import { clearSession } from "@/lib/backoffice/auth";
import { redirect } from "next/navigation";

export async function GET() {
  clearSession();
  redirect("/admin/login");
}
