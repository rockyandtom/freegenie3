"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";

export default function GoogleAnalytics() {
  // 如果没有配置 GA ID，不渲染任何内容
  if (!GA_TRACKING_ID) {
    return null;
  }

  // 使用 Next.js 的 GoogleAnalytics 组件（推荐方式）
  return (
    <>
      <NextGoogleAnalytics gaId={GA_TRACKING_ID} />
      
      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-CKC5HJ78SD"
        strategy="afterInteractive"
      />
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CKC5HJ78SD');
        `}
      </Script>
    </>
  );
}
