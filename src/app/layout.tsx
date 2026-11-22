import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DemoDialog } from "@/components/demo-dialog";

const bahnschrift = localFont({
  src: "../fonts/bahnschrift.ttf",
  variable: "--font-bahnschrift",
  weight: "300 700",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FaetonMES — MES-система для управления деревообрабатывающими и мебельными предприятиями",
  description: "Возможности и типовые решения FaetonMES для мебельной индустрии",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" id="top" className={bahnschrift.variable}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <DemoDialog />
      </body>
    </html>
  );
}
