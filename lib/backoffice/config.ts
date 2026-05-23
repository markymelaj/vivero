export const backofficeConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  sessionSecret: process.env.APP_SESSION_SECRET || "",
  publicBaseUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
};

export function requireBackofficeEnv() {
  const missing: string[] = [];
  if (!backofficeConfig.supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL o SUPABASE_URL");
  if (!backofficeConfig.serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!backofficeConfig.sessionSecret) missing.push("APP_SESSION_SECRET");
  if (missing.length) {
    throw new Error(`Faltan variables de entorno para Paesaggio Control: ${missing.join(", ")}`);
  }
}
