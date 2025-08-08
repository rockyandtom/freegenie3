import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // 检查是否需要重定向到 canonical 域名
  if (
    hostname === 'freegenie3-bxsv-rockyandtoms-projects.vercel.app' ||
    hostname.endsWith('.vercel.app') ||
    hostname === 'www.freegenie3.com'
  ) {
    url.hostname = 'freegenie3.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  // 如果是 canonical 域名，继续处理国际化
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(en)/:path*",
    "/((?!privacy-policy|terms-of-service|api|_next|_vercel|.*\\..*).*)",
  ],
};