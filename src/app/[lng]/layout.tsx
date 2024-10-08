import type { Metadata } from "next";
import localFont from "next/font/local";
import { dir } from "i18next";
import { languageCodes } from "../_i18n/settings";
import { useTranslation } from "../_i18n";
import ThemeProvider from "@/utils/ThemeProvider";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import "./globals.css";
import Header from "./_components/header/Header";

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
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header title={t("title")} />
            <main>{children}</main>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
