import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  DEFAULT_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "@/constants/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  openGraph: {
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full bg-slate-100 text-slate-950">{children}</body>
    </html>
  );
}