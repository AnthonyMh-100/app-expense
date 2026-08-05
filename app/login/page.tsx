import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginScreen from "@/components/login/LoginScreen";
import { getPageMetadata } from "@/constants/seo";
import { getCurrentCompany } from "@/lib/auth";

export const metadata: Metadata = getPageMetadata({
  title: "Iniciar sesión",
  description:
    "Accede al panel de caja diaria de imprenta con tus credenciales.",
  path: "/login",
  noindex: true,
});

export default async function LoginPage() {
  const company = await getCurrentCompany();

  if (company) redirect("/");

  return <LoginScreen />;
}
