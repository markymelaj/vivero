import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { backofficeConfig, requireBackofficeEnv } from "./config";
import { eq, selectRows } from "./supabase-rest";
import type { AppUser } from "./types";

const COOKIE_NAME = "paesaggio_session";
const SESSION_DAYS = 7;

type SessionPayload = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  exp: number;
};

function b64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string) {
  requireBackofficeEnv();
  return crypto.createHmac("sha256", backofficeConfig.sessionSecret).update(payload).digest("base64url");
}

function verifyPassword(password: string, stored: string) {
  const [scheme, n, r, p, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, Buffer.from(hash, "hex").length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  }).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(hash, "hex"));
}

export async function loginWithPassword(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const users = await selectRows<AppUser>("pa_app_users", {
    select: "id,email,full_name,role,password_hash,commission_rate,active",
    email: eq(normalized),
    active: "eq.true",
    limit: 1,
  });
  const user = users[0];
  if (!user?.password_hash || !verifyPassword(password, user.password_hash)) {
    return { ok: false, error: "Usuario o contraseña inválidos." };
  }
  await setSession(user);
  return { ok: true };
}

export async function setSession(user: AppUser) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 24 * 60 * 60;
  const payload: SessionPayload = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    exp,
  };
  const encoded = b64url(JSON.stringify(payload));
  const cookieValue = `${encoded}.${sign(encoded)}`;
  cookies().set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export function readSession(): SessionPayload | null {
  const raw = cookies().get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const [encoded, sig] = raw.split(".");
  if (!encoded || !sig || sig !== sign(encoded)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function requireSession() {
  const session = readSession();
  if (!session) redirect("/admin/login");
  return session;
}

export function clearSession() {
  cookies().delete(COOKIE_NAME);
}
