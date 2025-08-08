"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function CanonicalURL() {
  const pathname = usePathname();

  useEffect(() => {
    // 检查当前域名
    const currentHostname = window.location.hostname;
    
    // 如果已经是 canonical 域名，不需要额外处理
    if (currentHostname === 'freegenie3.com') {
      return;
    }

    // 构建 canonical URL
    const canonicalUrl = `https://freegenie3.com${pathname}`;

    // 移除现有的 canonical 标签
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // 创建新的 canonical 标签
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    
    // 添加到 head
    document.head.appendChild(canonical);

    // 清理函数
    return () => {
      const canonicalToRemove = document.querySelector('link[rel="canonical"]');
      if (canonicalToRemove) {
        canonicalToRemove.remove();
      }
    };
  }, [pathname]);

  return null;
}