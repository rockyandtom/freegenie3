import CanonicalURL from "./canonical";

export default function SEO() {
  // 只在非生产环境或非 canonical 域名时渲染
  if (typeof window !== 'undefined' && window.location.hostname === 'freegenie3.com') {
    return null;
  }
  
  return (
    <>
      <CanonicalURL />
    </>
  );
}