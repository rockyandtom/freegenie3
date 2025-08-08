import { LandingPage, PricingPage, ShowcasePage } from "@/types/pages/landing";

export async function getLandingPage(locale: string): Promise<LandingPage> {
  return (await getPage("landing", "en")) as LandingPage; // 始终使用英文
}

export async function getPricingPage(locale: string): Promise<PricingPage> {
  return (await getPage("pricing", "en")) as PricingPage; // 始终使用英文
}

export async function getShowcasePage(locale: string): Promise<ShowcasePage> {
  return (await getPage("showcase", "en")) as ShowcasePage; // 始终使用英文
}

export async function getPage(
  name: string,
  locale: string
): Promise<LandingPage | PricingPage | ShowcasePage> {
  try {
    return await import(
      `@/i18n/pages/${name}/en.json` // 始终使用英文配置
    ).then((module) => module.default);
  } catch (error) {
    console.error(`Failed to load page config: ${name}`);
    throw error;
  }
}