import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {locales} from './i18n/locale';

export default getRequestConfig(async ({requestLocale}) => {
  // Validate that the incoming `locale` parameter is valid
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as any)) notFound();

  // Load messages for the current locale
  const messages = {
    ...(await import(`./i18n/messages/${locale}.json`)).default,
    ...(await import(`./i18n/pages/landing/${locale}.json`)).default
  };

  return {
    locale,
    messages,
    timeZone: 'Asia/Shanghai'
  };
});