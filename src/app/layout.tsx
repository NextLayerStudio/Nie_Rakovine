import type { Metadata, Viewport } from "next";
import { League_Spartan } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  display: "swap",
});

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
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#CA6A8A",
  colorScheme: "light",
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
    <html lang="sk" className={leagueSpartan.className}>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
