"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { generateCanonicalUrl, isCanonicalDomain } from "@/lib/canonical";

export default function CanonicalURL() {
  const pathname = usePathname();

  useEffect(() => {
    // 检查当前域名是否需要设置 canonical
    const currentHostname = window.location.hostname;
    
    // 如果已经是 canonical 域名，不需要额外处理
    if (isCanonicalDomain(currentHostname)) {
      return;
    }

    // 移除现有的 canonical 标签
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // 解析语言和路径
    const pathSegments = pathname.split('/').filter(Boolean);
    const locale = pathSegments[0] === 'en' ? 'en' : 'en'; // 目前只支持英文
    const path = pathSegments.length > 0 && pathSegments[0] !== 'en' 
      ? pathname 
      : pathSegments.slice(1).join('/');

    // 创建新的 canonical 标签
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = generateCanonicalUrl(path, locale);
    
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