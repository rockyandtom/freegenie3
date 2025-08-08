# 域名配置指南 - freegenie3.com

## 🌐 域名配置概览

本项目已配置为使用 `freegenie3.com` 作为主域名。

### 📋 已完成的配置

#### 1. Vercel 配置 (`vercel.json`)
- ✅ 自动重定向所有非主域名到 `freegenie3.com`
- ✅ 添加安全头部配置
- ✅ API 函数超时设置

#### 2. Next.js 配置 (`next.config.mjs`)
- ✅ www 子域名重定向到主域名
- ✅ 安全头部配置
- ✅ DNS 预取控制

#### 3. 环境变量配置
- ✅ `.env.example` - 示例配置
- ✅ `.env.production` - 生产环境配置
- ✅ 更新所有相关 URL 为 `https://freegenie3.com`

#### 4. SEO 配置
- ✅ `robots.txt` - 搜索引擎爬虫配置
- ✅ `sitemap.xml` - 网站地图配置

### 🚀 部署步骤

#### 1. Vercel 项目设置
```bash
# 在 Vercel Dashboard 中：
1. 进入项目设置 (Settings)
2. 点击 "Domains" 标签
3. 添加自定义域名: freegenie3.com
4. 配置 DNS 记录指向 Vercel
```

#### 2. DNS 配置
在你的域名提供商处配置以下记录：

```dns
# A 记录 (或 CNAME)
freegenie3.com -> 76.76.19.61 (Vercel IP)

# CNAME 记录 (推荐)
freegenie3.com -> cname.vercel-dns.com

# www 重定向
www.freegenie3.com -> freegenie3.com (CNAME)
```

#### 3. Vercel 域名重定向
已配置以下 Vercel 域名自动重定向到 freegenie3.com：

```
freegenie3-bxsv-rockyandtoms-projects.vercel.app
freegenie3-bxsv-git-main-rockyandtoms-projects.vercel.app
freegenie3-bxsv-hqupl82mb-rockyandtoms-projects.vercel.app
所有其他 *.vercel.app 域名
```

#### 3. 环境变量设置
在 Vercel Dashboard 的 Environment Variables 中设置：

```env
NEXT_PUBLIC_WEB_URL=https://freegenie3.com
NEXT_PUBLIC_PROJECT_NAME=Genie 3 - AI Image to Video
NEXT_PUBLIC_CANONICAL_DOMAIN=freegenie3.com
AUTH_URL=https://freegenie3.com/api/auth
```

### 🔧 验证配置

#### 1. 域名解析检查
```bash
# 检查 DNS 解析
nslookup freegenie3.com
dig freegenie3.com

# 检查 HTTPS 证书
curl -I https://freegenie3.com
```

#### 2. 重定向测试
```bash
# 测试 www 重定向
curl -I https://www.freegenie3.com

# 测试其他域名重定向
curl -I https://your-vercel-domain.vercel.app
```

#### 3. SEO 验证
- 访问 `https://freegenie3.com/robots.txt`
- 访问 `https://freegenie3.com/sitemap.xml`
- 使用 Google Search Console 验证

### 📊 监控和分析

#### 1. 分析工具配置
- Google Analytics (设置 `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`)
- Plausible Analytics (设置 `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=freegenie3.com`)

#### 2. 性能监控
- Vercel Analytics 自动启用
- Core Web Vitals 监控

### 🛡️ 安全配置

已配置的安全头部：
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-DNS-Prefetch-Control: on`

### 📝 注意事项

1. **SSL 证书**: Vercel 自动提供 Let's Encrypt SSL 证书
2. **CDN**: Vercel 全球 CDN 自动启用
3. **缓存**: 静态资源自动缓存优化
4. **压缩**: Gzip/Brotli 压缩自动启用

### 🔄 更新域名

如需更改域名，请更新以下文件：
- `vercel.json`
- `next.config.mjs`
- `.env.production`
- `public/robots.txt`
- `public/sitemap.xml`

### 📞 支持

如遇到域名配置问题，请检查：
1. DNS 解析是否正确
2. Vercel 域名设置是否完成
3. 环境变量是否正确设置
4. 部署是否成功完成