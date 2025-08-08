import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { AppContextProvider } from "@/contexts/app";
import { Metadata } from "next";
import { NextAuthSessionProvider } from "@/auth/session";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/locale";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(params.locale as any)) notFound();

  setRequestLocale(params.locale);
  const messages = await getMessages();
  const t = await getTranslations();

  return {
    title: {
      template: `%s - Genie 3`,
      default: t("metadata.title") || "Genie 3 - AI Image to Video Generator",
    },
    description: t("metadata.description") || "Transform your static images into dynamic videos with Genie 3's powerful AI technology.",
    keywords: t("metadata.keywords") || "genie 3, image to video, AI video generation, photo animation",
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextAuthSessionProvider>
            <AppContextProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </AppContextProvider>
          </NextAuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}