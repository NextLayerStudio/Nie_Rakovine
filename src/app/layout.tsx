import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ONKO KLUB",
  description:
    "Podporná aplikácia pre ľudí s onkologickým ochorením. Komunita, informácie a aktivity na jednom mieste.",
  applicationName: "ONKO KLUB",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ONKO KLUB",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#6F2380",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk">
      <body>{children}</body>
    </html>
  );
}
