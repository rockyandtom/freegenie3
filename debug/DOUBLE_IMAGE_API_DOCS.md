# RunningHub 双图片 API 文档

## 概述

本项目已成功集成了新的 RunningHub 双图片应用，支持使用两张图片生成视频。新的 API 配置如下：

- **WebApp ID**: `1955909545925246978`
- **API Key**: `fb88fac46b0349c1986c9cbb4f14d44e`
- **节点配置**:
  - 第一张图片节点 ID: `186`
  - 第二张图片节点 ID: `187`

## API 端点

```
POST /api/runninghub
```

## 支持的应用类型

现在 API 支持三种应用类型：

### 1. 双图片应用 (doubleImage)
**新增功能** - 使用两张图片生成视频

**请求参数:**
```json
{
    "action": "generate",
    "appType": "doubleImage",
    "image": "第一张图片的文件ID",
    "secondImage": "第二张图片的文件ID"
}
```

**自动检测:**
如果提供了 `image` 和 `secondImage`，但没有 `prompt` 和 `lastImage`，系统会自动使用双图片应用。

### 2. 单图片应用 (singleImage)
**原有功能** - 使用单张图片和提示词生成视频

**请求参数:**
```json
{
    "action": "generate",
    "appType": "singleImage",
    "image": "图片文件ID",
    "prompt": "提示词"
}
```

### 3. 首尾帧应用 (firstLastFrame)
**原有功能** - 使用首帧、尾帧和提示词生成视频

**请求参数:**
```json
{
    "action": "generate",
    "appType": "firstLastFrame",
    "image": "首帧图片文件ID",
    "lastImage": "尾帧图片文件ID",
    "prompt": "提示词"
}
```

## 状态查询

查询任务状态（所有应用类型通用）：

```json
{
    "action": "status",
    "taskId": "任务ID"
}
```

## 响应格式

### 成功响应
```json
{
    "success": true,
    "data": {
        "taskId": "任务ID",
        "status": "started",
        "message": "视频生成任务已启动",
        "appType": "doubleImage"
    }
}
```

### 状态查询响应

**运行中:**
```json
{
    "success": true,
    "data": {
        "taskId": "任务ID",
        "status": "running",
        "message": "视频生成中，状态: RUNNING"
    }
}
```

**完成:**
```json
{
    "success": true,
    "data": {
        "taskId": "任务ID",
        "status": "completed",
        "videoUrl": "https://example.com/video.mp4",
        "fileType": "video/mp4"
    }
}
```

### 错误响应
```json
{
    "success": false,
    "error": "错误描述",
    "details": "详细错误信息"
}
```

## 使用示例

### JavaScript/Node.js
```javascript
// 双图片生成
const response = await fetch('/api/runninghub', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        action: 'generate',
        appType: 'doubleImage',
        image: '13b1937e7047c9f5a938d0416a64b7c260902e2d5926b7ada3fbbe6d82649947.png',
        secondImage: '1974b99b6b1a9544b8622c6ce4059922e2aa22230013f9d198a3afb30ae70e92.png'
    })
});

const result = await response.json();
if (result.success) {
    console.log('任务ID:', result.data.taskId);
}
```

### cURL
```bash
curl --location --request POST 'http://localhost:3000/api/runninghub' \
--header 'Content-Type: application/json' \
--data-raw '{
    "action": "generate",
    "appType": "doubleImage",
    "image": "13b1937e7047c9f5a938d0416a64b7c260902e2d5926b7ada3fbbe6d82649947.png",
    "secondImage": "1974b99b6b1a9544b8622c6ce4059922e2aa22230013f9d198a3afb30ae70e92.png"
}'
```

### Python
```python
import requests
import json

url = "http://localhost:3000/api/runninghub"
payload = {
    "action": "generate",
    "appType": "doubleImage", 
    "image": "13b1937e7047c9f5a938d0416a64b7c260902e2d5926b7ada3fbbe6d82649947.png",
    "secondImage": "1974b99b6b1a9544b8622c6ce4059922e2aa22230013f9d198a3afb30ae70e92.png"
}

response = requests.post(url, json=payload)
result = response.json()

if result.get('success'):
    print(f"任务ID: {result['data']['taskId']}")
```

## 参数验证

### 双图片应用
- ✅ 必须提供 `image` 和 `secondImage`
- ❌ 不需要 `prompt`

### 单图片应用
- ✅ 必须提供 `image` 和 `prompt`

### 首尾帧应用
- ✅ 必须提供 `image`、`lastImage` 和 `prompt`

## 错误处理

常见错误及解决方案：

1. **"Both images are required for double image app"**
   - 双图片应用需要提供两张图片

2. **"Image and prompt are required for single image app"**
   - 单图片应用需要图片和提示词

3. **"Image and prompt are required for first-last frame app"**
   - 首尾帧应用需要图片和提示词

4. **"Invalid action. Use 'generate' or 'status'"**
   - action 参数必须是 'generate' 或 'status'

## 测试文件

项目中包含以下测试文件：

1. `debug/test-double-image-api.js` - Node.js 测试脚本
2. `debug/double-image-api.http` - HTTP 请求测试文件
3. `debug/DOUBLE_IMAGE_API_DOCS.md` - 本文档

## 配置文件位置

API 配置位于：`src/app/api/runninghub/route.ts`

```typescript
doubleImageApp: {
    webappId: '1955909545925246978',
    apiKey: 'fb88fac46b0349c1986c9cbb4f14d44e',
    nodes: {
        firstImage: "186",
        secondImage: "187"
    }
}
```

## 注意事项

1. 图片文件需要先通过 RunningHub 上传 API 获取文件 ID
2. 任务状态查询建议间隔 10 秒以上
3. 所有应用使用相同的 API Key 进行状态查询
4. 任务完成后会返回视频 URL，可直接下载或在浏览器中播放
