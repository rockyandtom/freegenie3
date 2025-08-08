/**
 * 生成 canonical URL
 * @param path - 页面路径
 * @param locale - 语言代码
 * @returns canonical URL
 */
export function generateCanonicalUrl(path: string = '', locale: string = 'en'): string {
  const baseUrl = 'https://freegenie3.com';
  
  // 移除开头的斜杠
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // 如果是英文且路径为空，返回根域名
  if (locale === 'en' && !cleanPath) {
    return baseUrl;
  }
  
  // 如果是英文，不包含语言前缀
  if (locale === 'en') {
    return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
  }
  
  // 其他语言包含语言前缀
  return cleanPath ? `${baseUrl}/${locale}/${cleanPath}` : `${baseUrl}/${locale}`;
}

/**
 * 检查当前域名是否为 canonical 域名
 * @param hostname - 当前主机名
 * @returns 是否为 canonical 域名
 */
export function isCanonicalDomain(hostname: string): boolean {
  return hostname === 'freegenie3.com';
}

/**
 * 获取所有需要重定向的域名模式
 */
export const redirectDomains = [
  'freegenie3-bxsv-rockyandtoms-projects.vercel.app',
  'freegenie3-bxsv-git-main-rockyandtoms-projects.vercel.app',
  'freegenie3-bxsv-hqupl82mb-rockyandtoms-projects.vercel.app',
  /.*\.vercel\.app$/,
  'www.freegenie3.com'
];

/**
 * 检查域名是否需要重定向
 * @param hostname - 当前主机名
 * @returns 是否需要重定向
 */
export function shouldRedirect(hostname: string): boolean {
  return redirectDomains.some(domain => {
    if (typeof domain === 'string') {
      return hostname === domain;
    }
    return domain.test(hostname);
  });
}