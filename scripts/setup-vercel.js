#!/usr/bin/env node

/**
 * Vercel 部署设置脚本
 * 用于快速配置 Vercel 项目和环境变量
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Genie 3 Vercel 部署设置');
console.log('================================');

// 检查是否安装了 Vercel CLI
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI 已安装');
} catch (error) {
  console.log('❌ Vercel CLI 未安装，正在安装...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI 安装完成');
  } catch (installError) {
    console.error('❌ Vercel CLI 安装失败，请手动安装: npm install -g vercel');
    process.exit(1);
  }
}

// 检查环境变量文件
const envExamplePath = path.join(__dirname, '..', '.env.example');
const envLocalPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envLocalPath)) {
  console.log('📝 创建本地环境变量文件...');
  fs.copyFileSync(envExamplePath, envLocalPath);
  console.log('✅ 已创建 .env.local 文件，请填写必要的环境变量');
}

console.log('\n📋 部署步骤:');
console.log('1. 登录 Vercel: vercel login');
console.log('2. 部署项目: vercel');
console.log('3. 配置生产环境: vercel --prod');
console.log('4. 在 Vercel Dashboard 中配置环境变量');
console.log('5. 添加自定义域名: freegenie3.com');

console.log('\n🔗 有用的链接:');
console.log('- Vercel Dashboard: https://vercel.com/dashboard');
console.log('- GitHub Repository: https://github.com/rockyandtom/freegenie3');
console.log('- 部署文档: ./DEPLOYMENT.md');

console.log('\n✨ 设置完成！');