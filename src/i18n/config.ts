import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {locales} from './locale';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Validate that the incoming `locale` parameter is valid
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as any)) notFound();
 
  return {
    locale,
    messages: {
      ...(await import(`./messages/${locale}.json`)).default,
      ...(await import(`./pages/landing/${locale}.json`)).default
    }
  };
});