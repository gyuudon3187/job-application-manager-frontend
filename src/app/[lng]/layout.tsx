import type { Metadata } from "next";
import localFont from "next/font/local";
import { dir } from "i18next";
import { languageCodes } from "../_i18n/settings";
import { useTranslation } from "../_i18n";
import "./globals.css";
import Header from "./_components/header/Header";
import Providers from "@/utils/providers/Providers";

export async function generateStaticParams() {
  return languageCodes.map((lng) => ({ lng }));
}

const geistSans = localFont({
  src: "./_fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./_fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Job Application Manager",
  description: "Web app for managing job applications",
};

export default async function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: React.ReactNode;
  params: { lng: string };
}>) {
  const { t } = await useTranslation(lng, "header");

  return (
    <html lang={lng} dir={dir(lng)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-500 px-4 py-16`}
      >
        <Providers lng={lng}>
          <Header title={t("title")} />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
