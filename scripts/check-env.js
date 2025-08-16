#!/usr/bin/env node

/**
 * 环境变量检查脚本
 * 验证所有必需的环境变量是否已设置
 */

require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
  'NEXT_PUBLIC_WEB_URL',
  'NEXT_PUBLIC_PROJECT_NAME',
  'NEXT_PUBLIC_CANONICAL_DOMAIN',
  'DATABASE_URL',
  'AUTH_SECRET',
  'AUTH_URL'
];

const optionalEnvVars = [
  'AUTH_GOOGLE_ID',
  'AUTH_GOOGLE_SECRET',
  'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID',
  'STRIPE_PUBLIC_KEY',
  'STRIPE_PRIVATE_KEY',
  'STORAGE_ENDPOINT',
  'STORAGE_REGION',
  'STORAGE_ACCESS_KEY',
  'STORAGE_SECRET_KEY',
  'STORAGE_BUCKET',
  'STORAGE_DOMAIN'
];

console.log('🔍 环境变量检查');
console.log('==================');

let missingRequired = [];
let missingOptional = [];

// 检查必需的环境变量
console.log('\n✅ 必需的环境变量:');
requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`  ✓ ${envVar}: ${process.env[envVar].substring(0, 20)}...`);
  } else {
    console.log(`  ❌ ${envVar}: 未设置`);
    missingRequired.push(envVar);
  }
});

// 检查可选的环境变量
console.log('\n⚠️  可选的环境变量:');
optionalEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`  ✓ ${envVar}: ${process.env[envVar].substring(0, 20)}...`);
  } else {
    console.log(`  - ${envVar}: 未设置`);
    missingOptional.push(envVar);
  }
});

// 总结
console.log('\n📊 检查结果:');
if (missingRequired.length === 0) {
  console.log('✅ 所有必需的环境变量都已设置');
} else {
  console.log(`❌ 缺少 ${missingRequired.length} 个必需的环境变量:`);
  missingRequired.forEach(envVar => console.log(`  - ${envVar}`));
}

if (missingOptional.length > 0) {
  console.log(`⚠️  ${missingOptional.length} 个可选环境变量未设置，某些功能可能不可用`);
}

console.log('\n💡 提示:');
console.log('- 复制 .env.example 到 .env.local 并填写值');
console.log('- 在 Vercel Dashboard 中配置生产环境变量');
console.log('- 查看 DEPLOYMENT.md 获取详细配置说明');

if (missingRequired.length > 0) {
  process.exit(1);
}