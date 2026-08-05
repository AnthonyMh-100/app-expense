import type { Metadata } from "next";

export const SITE_NAME = "Caja diaria de imprenta";
export const SITE_DESCRIPTION =
  "Sistema de gestión de caja diaria para imprentas: panel, movimientos, cobros pendientes y cierre de caja.";
export const SITE_LOCALE = "es_PE";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const DEFAULT_KEYWORDS = [
  "caja diaria",
  "imprenta",
  "movimientos",
  "gastos",
  "ingresos",
  "cobros pendientes",
  "cierre de caja",
];

export const getPageMetadata = ({
  title,
  description,
  path = "/",
  keywords = [],
  noindex = false,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noindex?: boolean;
}): Metadata => {
  const canonical = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    keywords: [...DEFAULT_KEYWORDS, ...keywords],
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "website",
    },
  };
};