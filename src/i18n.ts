import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {locales} from './i18n/locale';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Load messages for the current locale
  const messages = {
    ...(await import(`./i18n/messages/${locale}.json`)).default,
    ...(await import(`./i18n/pages/landing/${locale}.json`)).default
  };

  return {
    messages,
    timeZone: 'Asia/Shanghai'
  };
});