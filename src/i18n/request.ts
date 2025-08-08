import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./locale";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  try {
    const messages = {
      ...(await import(`./messages/${locale.toLowerCase()}.json`)).default,
      ...(await import(`./pages/landing/${locale.toLowerCase()}.json`)).default
    };
    
    return {
      locale: locale,
      messages,
      timeZone: 'Asia/Shanghai'
    };
  } catch (e) {
    // Fallback to English if there's any error
    const messages = {
      ...(await import(`./messages/en.json`)).default,
      ...(await import(`./pages/landing/en.json`)).default
    };
    
    return {
      locale: 'en',
      messages,
      timeZone: 'Asia/Shanghai'
    };
  }
});