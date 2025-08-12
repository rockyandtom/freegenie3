// Google Analytics gtag 配置和工具函数

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-CKC5HJ78SD';

// 检查是否启用了 GA
export const isGAEnabled = (): boolean => {
  return !!GA_TRACKING_ID && typeof window !== 'undefined';
};

// 页面浏览事件
export const pageview = (url: string): void => {
  if (!isGAEnabled()) return;
  
  window.gtag('config', GA_TRACKING_ID, {
    page_location: url,
  });
};

// 自定义事件
export const event = (
  action: string,
  category: string,
  label?: string,
  value?: number
): void => {
  if (!isGAEnabled()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// 视频生成事件
export const trackVideoGeneration = (
  mode: 'single' | 'firstLast',
  success: boolean,
  duration?: number
): void => {
  event(
    success ? 'video_generation_success' : 'video_generation_failed',
    'video_generation',
    mode,
    duration
  );
};

// 图片上传事件
export const trackImageUpload = (fileSize: number, fileType: string): void => {
  event('image_upload', 'user_interaction', fileType, fileSize);
};

// 提示词使用事件
export const trackPromptUsage = (promptLength: number, hasLastFrame: boolean): void => {
  event(
    'prompt_usage',
    'user_interaction',
    hasLastFrame ? 'with_last_frame' : 'single_image',
    promptLength
  );
};

// 声明全局 gtag 函数类型
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}