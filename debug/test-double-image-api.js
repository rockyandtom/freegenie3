// 测试双图片 RunningHub API 的示例代码
// 这个文件展示如何调用新添加的双图片应用

const API_BASE_URL = 'http://localhost:3000'; // 根据您的开发环境调整

// 测试双图片生成
async function testDoubleImageGeneration() {
    console.log('=== 测试双图片生成 ===');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/runninghub`, {
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
        console.log('API 响应:', result);

        if (result.success && result.data && result.data.taskId) {
            console.log('任务创建成功，Task ID:', result.data.taskId);
            
            // 轮询检查任务状态
            await pollTaskStatus(result.data.taskId);
        } else {
            console.error('任务创建失败:', result.error);
        }
    } catch (error) {
        console.error('API 调用失败:', error);
    }
}

// 轮询任务状态
async function pollTaskStatus(taskId) {
    console.log(`\n=== 轮询任务状态: ${taskId} ===`);
    
    const maxAttempts = 30; // 最多尝试 30 次
    const interval = 10000; // 每 10 秒检查一次
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`第 ${attempt} 次检查状态...`);
            
            const response = await fetch(`${API_BASE_URL}/api/runninghub`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'status',
                    taskId: taskId
                })
            });

            const result = await response.json();
            console.log('状态响应:', result);

            if (result.success && result.data) {
                if (result.data.status === 'completed') {
                    console.log('✅ 任务完成！');
                    console.log('视频 URL:', result.data.videoUrl);
                    break;
                } else if (result.data.status === 'running') {
                    console.log('⏳ 任务运行中，继续等待...');
                } else {
                    console.log('❓ 未知状态:', result.data.status);
                }
            } else {
                console.error('❌ 状态查询失败:', result.error);
                break;
            }

            // 如果不是最后一次尝试，等待一段时间
            if (attempt < maxAttempts) {
                console.log(`等待 ${interval / 1000} 秒后再次检查...`);
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        } catch (error) {
            console.error('状态查询异常:', error);
            break;
        }
    }
}

// 测试单图片生成（原有功能）
async function testSingleImageGeneration() {
    console.log('\n=== 测试单图片生成 ===');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/runninghub`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'generate',
                appType: 'singleImage',
                image: '13b1937e7047c9f5a938d0416a64b7c260902e2d5926b7ada3fbbe6d82649947.png',
                prompt: '一个美丽的自然风景视频'
            })
        });

        const result = await response.json();
        console.log('单图片 API 响应:', result);
    } catch (error) {
        console.error('单图片 API 调用失败:', error);
    }
}

// 测试首尾帧生成（原有功能）
async function testFirstLastFrameGeneration() {
    console.log('\n=== 测试首尾帧生成 ===');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/runninghub`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'generate',
                appType: 'firstLastFrame',
                image: '13b1937e7047c9f5a938d0416a64b7c260902e2d5926b7ada3fbbe6d82649947.png',
                lastImage: '1974b99b6b1a9544b8622c6ce4059922e2aa22230013f9d198a3afb30ae70e92.png',
                prompt: '从第一张图片过渡到最后一张图片的平滑动画'
            })
        });

        const result = await response.json();
        console.log('首尾帧 API 响应:', result);
    } catch (error) {
        console.error('首尾帧 API 调用失败:', error);
    }
}

// 主测试函数
async function runTests() {
    console.log('开始测试 RunningHub API...\n');
    
    // 测试双图片生成（新功能）
    await testDoubleImageGeneration();
    
    // 等待一段时间
    console.log('\n等待 5 秒后测试其他功能...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 测试其他功能
    await testSingleImageGeneration();
    await testFirstLastFrameGeneration();
    
    console.log('\n所有测试完成！');
}

// 如果直接运行这个文件
if (require.main === module) {
    runTests();
}

module.exports = {
    testDoubleImageGeneration,
    testSingleImageGeneration,
    testFirstLastFrameGeneration,
    pollTaskStatus
};
