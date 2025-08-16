# 部署指南

## 自动部署设置

### 1. GitHub 仓库
项目已推送到: https://github.com/rockyandtom/freegenie3

### 2. Vercel 自动部署

#### 步骤 1: 连接 Vercel
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 选择 GitHub 仓库: `rockyandtom/freegenie3`
4. 配置项目设置:
   - Framework Preset: Next.js
   - Root Directory: `./` (默认)
   - Build Command: `pnpm build`
   - Output Directory: `.next` (默认)
   - Install Command: `pnpm install`

#### 步骤 2: 环境变量配置
在 Vercel 项目设置中添加以下环境变量:

**基础配置:**
```
NEXT_PUBLIC_WEB_URL=https://freegenie3.com
NEXT_PUBLIC_PROJECT_NAME=Genie 3 - AI Image to Video
NEXT_PUBLIC_CANONICAL_DOMAIN=freegenie3.com
```

**数据库配置:**
```
DATABASE_URL=your_supabase_database_url
```

**认证配置:**
```
AUTH_SECRET=your_auth_secret
AUTH_URL=https://freegenie3.com/api/auth
AUTH_TRUST_HOST=true
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
NEXT_PUBLIC_AUTH_GOOGLE_ID=your_google_client_id
```

**分析配置:**
```
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-CKC5HJ78SD
```

**支付配置 (Stripe):**
```
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_PRIVATE_KEY=your_stripe_private_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

**存储配置 (AWS S3):**
```
STORAGE_ENDPOINT=your_s3_endpoint
STORAGE_REGION=your_s3_region
STORAGE_ACCESS_KEY=your_s3_access_key
STORAGE_SECRET_KEY=your_s3_secret_key
STORAGE_BUCKET=your_s3_bucket
STORAGE_DOMAIN=your_s3_domain
```

#### 步骤 3: 域名配置
1. 在 Vercel 项目设置中添加自定义域名: `freegenie3.com`
2. 配置 DNS 记录指向 Vercel

### 3. 自动部署流程

一旦设置完成，每次推送到 `main` 分支时，Vercel 会自动:
1. 检测代码变更
2. 安装依赖 (`pnpm install`)
3. 构建项目 (`pnpm build`)
4. 部署到生产环境
5. 更新 freegenie3.com 域名

### 4. GitHub Actions CI/CD

项目包含 GitHub Actions 工作流，会在每次推送时:
- 运行代码检查 (`pnpm lint`)
- 构建项目验证 (`pnpm build`)

### 5. 部署验证

部署完成后，访问以下链接验证:
- 生产环境: https://freegenie3.com
- Vercel 预览: https://freegenie3-git-main-rockyandtoms-projects.vercel.app

### 6. 监控和日志

- Vercel Dashboard: 查看部署状态和日志
- GitHub Actions: 查看 CI/CD 流程状态
- Vercel Analytics: 监控网站性能

## 手动部署命令

如需手动部署:

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署到生产环境
vercel --prod
```

## 故障排除

1. **构建失败**: 检查环境变量是否正确配置
2. **域名问题**: 确认 DNS 记录正确指向 Vercel
3. **数据库连接**: 验证 DATABASE_URL 是否有效
4. **认证问题**: 检查 Google OAuth 配置

## 联系支持

如遇到部署问题，请检查:
- Vercel 部署日志
- GitHub Actions 运行日志
- 项目环境变量配置