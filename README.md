# Genie 3 Imagetovideo AI

Transform your images into stunning videos with AI-powered technology. Create cinematic videos from static images in seconds.

![preview](preview.png)

## Quick Start

1. Clone the repository

```bash
git clone https://github.com/rockyandtom/freegenie3.git
cd freegenie3
```

2. Install dependencies

```bash
pnpm install
```

3. Run the development server

```bash
pnpm dev
```

## Customize

- Set your environment variables

```bash
cp .env.example .env.development
```

- Set your theme in `src/app/theme.css`

[tweakcn](https://tweakcn.com/editor/theme)

- Set your landing page content in `src/i18n/pages/landing`

- Set your i18n messages in `src/i18n/messages`

## Deploy

### Automatic Deployment

This project is configured for automatic deployment to Vercel:

- **Production URL**: https://freegenie3.com
- **GitHub Repository**: https://github.com/rockyandtom/freegenie3

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frockyandtom%2Ffreegenie3&project-name=freegenie3&repository-name=freegenie3&redirect-url=https%3A%2F%2Ffreegenie3.com&demo-title=Genie%203%20-%20AI%20Image%20to%20Video&demo-description=Transform%20your%20images%20into%20stunning%20videos%20with%20AI-powered%20technology&demo-url=https%3A%2F%2Ffreegenie3.com&demo-image=https%3A%2F%2Ffreegenie3.com%2Fpreview.png)

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

- Deploy to Cloudflare

for new project, clone with branch "cloudflare"

```shell
git clone -b cloudflare https://github.com/shipanyai/shipany-template-one.git
```

for exist project, checkout to branch "cloudflare"

```shell
git checkout cloudflare
```

1. Customize your environment variables

```bash
cp .env.example .env.production
cp wrangler.toml.example wrangler.toml
```

edit your environment variables in `.env.production`

and put all the environment variables under `[vars]` in `wrangler.toml`

2. Deploy

```bash
npm run cf:deploy
```

## Community

- [ShipAny](https://shipany.ai)
- [Documentation](https://docs.shipany.ai)

## License

- [ShipAny AI SaaS Boilerplate License Agreement](LICENSE)
