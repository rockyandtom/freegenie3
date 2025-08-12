"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";

export default function GoogleAnalytics() {
  // 使用环境变量或回退到硬编码的 ID
  const trackingId = GA_TRACKING_ID || 'G-CKC5HJ78SD';
  
  // 只在生产环境或有有效 tracking ID 时渲染
  if (process.env.NODE_ENV !== 'production' && !GA_TRACKING_ID) {
    return null;
  }

  // 使用 Next.js 的 GoogleAnalytics 组件（推荐方式）
  return (
    <>
      <NextGoogleAnalytics gaId={trackingId} />
      
      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingId}');
        `}
      </Script>
    </>
  );
}
