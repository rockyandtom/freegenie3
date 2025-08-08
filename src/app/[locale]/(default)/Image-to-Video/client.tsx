"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import { trackVideoGeneration, trackImageUpload, trackPromptUsage } from "@/lib/gtag";

interface UploadedImage {
  file: File;
  preview: string;
}

export default function ImageToVideoClient() {
  const [firstFrame, setFirstFrame] = useState<UploadedImage | null>(null);
  const [lastFrame, setLastFrame] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<Array<{
    id: string;
    videoUrl: string;
    prompt: string;
    timestamp: Date;
    mode: 'single' | 'firstLast';
  }>>([]);

  const firstFrameRef = useRef<HTMLInputElement>(null);
  const lastFrameRef = useRef<HTMLInputElement>(null);

  // 键盘快捷键支持
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter 生成视频
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isGenerating && firstFrame && prompt) {
        e.preventDefault();
        generateVideo();
      }
      // Escape 取消错误显示
      if (e.key === 'Escape' && lastError) {
        setLastError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGenerating, firstFrame, prompt, lastError]);

  const handleImageUpload = (file: File, setImage: (image: UploadedImage) => void) => {
    if (file && file.type.startsWith('image/')) {
      // 跟踪图片上传事件
      trackImageUpload(file.size, file.type);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage({
          file,
          preview: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent, setImage: (image: UploadedImage) => void) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0], setImage);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const generateVideo = async () => {
    if (!firstFrame || !prompt) {
      alert("Please upload at least the first frame image and enter a prompt");
      return;
    }

    // 跟踪提示词使用
    trackPromptUsage(prompt.length, !!lastFrame);

    setIsGenerating(true);
    setGeneratedVideo(null);
    setTaskId(null);
    setProgress(0);
    setEstimatedTime("Initializing...");
    setRetryCount(0);
    setLastError(null);
    
    try {
      // 上传图片并获取文件名
      const imageData = await uploadImageToRunningHub(firstFrame.file);
      let lastImageData = undefined;
      
      // 如果有最后一帧图片，也上传它
      if (lastFrame) {
        lastImageData = await uploadImageToRunningHub(lastFrame.file);
      }
      
      // 调用RunningHub API开始生成视频
      const response = await fetch('/api/runninghub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          image: imageData,
          lastImage: lastImageData,
          prompt: prompt
        })
      });

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success && result.data.taskId) {
        setTaskId(result.data.taskId);
        // 开始轮询任务状态
        pollTaskStatus(result.data.taskId);
      } else {
        console.error('API Error:', result);
        throw new Error(result.error || 'Failed to start video generation');
      }
      
    } catch (error) {
      console.error('Video generation error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate video, please try again";
      
      // 跟踪视频生成启动失败事件
      trackVideoGeneration(
        lastFrame ? 'firstLast' : 'single',
        false,
        0 // 启动失败，时长为0
      );
      
      alert(errorMessage);
      setIsGenerating(false);
      setTaskId(null);
      setProgress(0);
      setEstimatedTime("");
    }
  };

  // 轮询任务状态
  const pollTaskStatus = async (taskId: string) => {
    const maxAttempts = 360; // 最多轮询30分钟 (360 * 5秒 = 1800秒 = 30分钟)
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const response = await fetch('/api/runninghub', {
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
        console.log(`Status check result (attempt ${attempts + 1}):`, result);
        
        if (result.success) {
          if (result.data.status === 'completed' && result.data.videoUrl) {
            console.log('Task completed, video URL:', result.data.videoUrl);
            
            // 计算生成时长
            const generationDuration = (attempts * 5) / 60; // 分钟
            
            // 跟踪视频生成成功事件
            trackVideoGeneration(
              lastFrame ? 'firstLast' : 'single',
              true,
              Math.round(generationDuration * 60) // 转换为秒
            );
            
            setGeneratedVideo(result.data.videoUrl);
            setIsGenerating(false);
            
            // 添加到历史记录
            const historyItem = {
              id: taskId,
              videoUrl: result.data.videoUrl,
              prompt: prompt,
              timestamp: new Date(),
              mode: lastFrame ? 'firstLast' as const : 'single' as const
            };
            setGenerationHistory(prev => [historyItem, ...prev.slice(0, 4)]); // 只保留最近5个
            
            return;
          } else if (result.data.status === 'running') {
            attempts++;
            
            // 计算进度 (基于时间估算，前10分钟进度较快，后面较慢)
            const elapsedMinutes = (attempts * 5) / 60; // 已经过的分钟数
            let progressPercent = 0;
            let timeEstimate = "";
            
            if (elapsedMinutes < 5) {
              progressPercent = Math.min(20, elapsedMinutes * 4); // 前5分钟到20%
              timeEstimate = "Initializing and processing...";
            } else if (elapsedMinutes < 10) {
              progressPercent = 20 + Math.min(30, (elapsedMinutes - 5) * 6); // 5-10分钟到50%
              timeEstimate = "Generating video frames...";
            } else if (elapsedMinutes < 15) {
              progressPercent = 50 + Math.min(25, (elapsedMinutes - 10) * 5); // 10-15分钟到75%
              timeEstimate = "Rendering and optimizing...";
            } else if (elapsedMinutes < 25) {
              progressPercent = 75 + Math.min(15, (elapsedMinutes - 15) * 1.5); // 15-25分钟到90%
              timeEstimate = "Final processing...";
            } else {
              progressPercent = Math.min(95, 90 + (elapsedMinutes - 25) * 1); // 25分钟后到95%
              timeEstimate = "Almost done...";
            }
            
            setProgress(Math.round(progressPercent));
            setEstimatedTime(timeEstimate);
            
            console.log(`Task still running, attempt ${attempts}/${maxAttempts}, progress: ${progressPercent.toFixed(1)}%, message: ${result.data.message}`);
            
            if (attempts < maxAttempts) {
              setTimeout(checkStatus, 5000); // 5秒后再次检查
            } else {
              throw new Error('Task timeout - Video generation took longer than expected (30 minutes). Please try again.');
            }
          } else {
            console.error('Unexpected status:', result.data.status, 'Message:', result.data.message);
            throw new Error(result.data.message || `Unexpected status: ${result.data.status}`);
          }
        } else {
          throw new Error(result.error || 'Status check failed');
        }
      } catch (error) {
        console.error('Status check error:', error);
        const errorMessage = error instanceof Error ? error.message : "Failed to check video generation status";
        
        // 如果是网络错误且重试次数少于3次，则自动重试
        if (attempts < 3 && (errorMessage.includes('fetch') || errorMessage.includes('network'))) {
          console.log(`Network error, retrying in 10 seconds... (attempt ${attempts + 1}/3)`);
          setTimeout(checkStatus, 10000);
          return;
        }
        
        // 跟踪视频生成失败事件
        trackVideoGeneration(
          lastFrame ? 'firstLast' : 'single',
          false,
          (attempts * 5) // 失败时的时长（秒）
        );
        
        setLastError(errorMessage);
        alert(errorMessage);
        setIsGenerating(false);
        setTaskId(null);
        setProgress(0);
        setEstimatedTime("");
      }
    };

    checkStatus();
  };

  // 上传图片到RunningHub并获取文件ID
  const uploadImageToRunningHub = async (file: File): Promise<string> => {
    console.log('Uploading file to RunningHub:', file.name, file.size, file.type);
    
    // 创建FormData上传图片到RunningHub
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 调用我们的API来上传到RunningHub
      const response = await fetch('/api/runninghub-upload', {
        method: 'POST',
        body: formData
      });

      console.log('RunningHub upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('RunningHub upload failed:', errorText);
        throw new Error(`Failed to upload image to RunningHub: ${response.status}`);
      }

      const result = await response.json();
      console.log('RunningHub upload result:', result);
      
      if (!result.success || !result.fileId) {
        throw new Error('No file ID returned from RunningHub upload');
      }
      
      return result.fileId; // 返回RunningHub的文件ID，格式如：api/xxx.png
    } catch (error) {
      console.error('RunningHub upload error:', error);
      throw error; // 不使用fallback，因为必须是有效的RunningHub文件ID
    }
  };

  const UploadArea = ({ 
    image, 
    setImage, 
    title, 
    inputRef, 
    required = false 
  }: {
    image: UploadedImage | null;
    setImage: (image: UploadedImage) => void;
    title: string;
    inputRef: React.RefObject<HTMLInputElement>;
    required?: boolean;
  }) => (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        {title}
        {required && <span className="text-red-500">*</span>}
      </h3>
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          "hover:border-primary/50 hover:bg-primary/5",
          "focus-within:border-primary focus-within:bg-primary/5",
          image ? "border-primary bg-primary/10" : "border-muted-foreground/25"
        )}
        onDrop={(e) => handleDrop(e, setImage)}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
      >
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file, setImage);
          }}
        />
        
        {image ? (
          <div className="space-y-3">
            <img
              src={image.preview}
              alt={title}
              className="max-h-32 mx-auto rounded-md object-cover"
            />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{image.file.name}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(null as any);
                }}
              >
                Reselect
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="RiImageAddLine" className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Click to upload or drag image here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports JPG, PNG, GIF formats, size up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              AI Image to Video
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your static images into dynamic videos with Genie 3's powerful AI technology.
              Simply upload an image and describe the effect you want.
            </p>
          </div>

          {/* Main Content Area */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="RiVideoLine" className="w-5 h-5 text-primary" />
                Create Your Video
              </CardTitle>
              <CardDescription>
                Upload images and add prompts, AI will generate amazing video content for you.
                {lastFrame ? (
                  <span className="block mt-2 text-sm text-green-600 dark:text-green-400">
                    <Icon name="RiCheckLine" className="w-4 h-4 inline mr-1" />
                    First & Last Frame Mode: More precise control over video transitions
                  </span>
                ) : (
                  <span className="block mt-2 text-sm text-blue-600 dark:text-blue-400">
                    <Icon name="RiInformationLine" className="w-4 h-4 inline mr-1" />
                    Single Image Mode: Upload a last frame for better control
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Image Upload Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UploadArea
                  image={firstFrame}
                  setImage={setFirstFrame}
                  title="First Frame"
                  inputRef={firstFrameRef}
                  required
                />
                
                <UploadArea
                  image={lastFrame}
                  setImage={setLastFrame}
                  title="Last Frame (Optional)"
                  inputRef={lastFrameRef}
                />
              </div>

              {/* Mode Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                    <Icon name="RiImageLine" className="w-4 h-4" />
                    <span className="font-medium">Single Image Mode</span>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 text-xs">
                    AI automatically generates natural motion and transitions from your single image
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-2">
                    <Icon name="RiVideoLine" className="w-4 h-4" />
                    <span className="font-medium">First & Last Frame Mode</span>
                  </div>
                  <p className="text-green-600 dark:text-green-400 text-xs">
                    Precise control over start and end states for smoother, more predictable transitions
                  </p>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  Video Description Prompt
                  <span className="text-red-500">*</span>
                </h3>
                <Textarea
                  placeholder={lastFrame 
                    ? "Describe the transition between frames, e.g.: 一束光照下来，镜头围绕角色旋转，角色丝滑变身"
                    : "Describe the motion you want, e.g.: character moves from left to right, leaves sway in the wind, camera slowly pushes in..."
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                
                {/* Quick Prompt Suggestions */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Quick Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {(lastFrame ? [
                      "镜头缓慢推进，光影变化",
                      "角色从静止到动作",
                      "背景从模糊到清晰",
                      "色彩渐变过渡"
                    ] : [
                      "Camera slowly zooms in",
                      "Gentle wind effect",
                      "Soft lighting changes",
                      "Character subtle movement",
                      "Background blur effect"
                    ]).map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          if (prompt) {
                            setPrompt(prompt + ", " + suggestion);
                          } else {
                            setPrompt(suggestion);
                          }
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Icon name="RiLightbulbLine" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Prompt Tips:</p>
                    <ul className="space-y-1">
                      <li>• Describe camera movements (zoom, pan, rotate)</li>
                      <li>• Mention lighting changes (光照, 阴影)</li>
                      <li>• Include motion details (smooth, fast, slow)</li>
                      {lastFrame && <li>• Focus on the transition between your two frames</li>}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={generateVideo}
                  disabled={!firstFrame || !prompt || isGenerating}
                  className="px-8 py-3 text-base font-medium"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Icon name="RiLoader4Line" className="w-4 h-4 animate-spin mr-2" />
                      {taskId ? 'Processing...' : 'Starting...'}
                    </>
                  ) : (
                    <>
                      <Icon name="RiPlayLine" className="w-4 h-4 mr-2" />
                      Generate Video
                      <span className="ml-2 text-xs opacity-60">
                        (Ctrl+Enter)
                      </span>
                    </>
                  )}
                </Button>
              </div>

              {/* Generation Mode Info */}
              {(firstFrame || lastFrame) && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Icon name={lastFrame ? "RiVideoLine" : "RiImageLine"} className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Mode: {lastFrame ? "First & Last Frame" : "Single Image"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {lastFrame 
                      ? "Using advanced first-last frame mode for precise video control"
                      : "Using single image mode - add a last frame for better control"
                    }
                  </p>
                </div>
              )}

              {/* Error Display */}
              {lastError && !isGenerating && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <Icon name="RiErrorWarningLine" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                        Generation Failed
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                        {lastError}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setLastError(null);
                            generateVideo();
                          }}
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                        >
                          <Icon name="RiRefreshLine" className="w-4 h-4 mr-1" />
                          Retry
                        </Button>
                        <Button
                          onClick={() => setLastError(null)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Task Status */}
              {taskId && isGenerating && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-3">
                    <Icon name="RiInformationLine" className="w-4 h-4" />
                    <span className="text-sm font-medium">Task ID: {taskId}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Video Generation in Progress
                      </span>
                      <span className="text-xs text-blue-500 dark:text-blue-400 ml-auto">
                        {progress}%
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-blue-100 dark:bg-blue-800/30 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-blue-600 dark:text-blue-400">
                        Using {lastFrame ? "first-last frame" : "single image"} mode
                      </span>
                      <span className="text-blue-500 dark:text-blue-400 font-medium">
                        {estimatedTime}
                      </span>
                    </div>
                    
                    <div className="bg-blue-100 dark:bg-blue-800/30 rounded-md p-3 mt-3">
                      <div className="flex items-start gap-2">
                        <Icon name="RiTimeLine" className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          <p className="font-medium mb-1">Expected Generation Time:</p>
                          <p>• Typical: 10-15 minutes</p>
                          <p>• Maximum: up to 30 minutes</p>
                          <p className="mt-2 font-medium">Please keep this page open and be patient. Your video will appear automatically when ready.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Video Result */}
          {generatedVideo && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="RiVideoLine" className="w-5 h-5 text-green-600" />
                  Generated Video
                </CardTitle>
                <CardDescription>
                  Your AI-generated video is ready! You can download or share it.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg border border-border/20 bg-muted/10 relative">
                  <video
                    src={generatedVideo}
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    poster=""
                    onLoadStart={() => console.log('Video loading started')}
                    onCanPlay={() => console.log('Video can play')}
                    onError={(e) => console.error('Video error:', e)}
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {lastFrame ? 'First-Last Frame' : 'Single Image'}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedVideo;
                      link.download = `genie3-video-${Date.now()}.mp4`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <Icon name="RiDownloadLine" className="w-4 h-4" />
                    Download Video
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'My Genie 3 Generated Video',
                          url: generatedVideo
                        });
                      } else {
                        navigator.clipboard.writeText(generatedVideo);
                        alert('Video URL copied to clipboard!');
                      }
                    }}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Icon name="RiShareLine" className="w-4 h-4" />
                    Share Video
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setGeneratedVideo(null);
                      setTaskId(null);
                      setFirstFrame(null);
                      setLastFrame(null);
                      setPrompt("");
                      setProgress(0);
                      setEstimatedTime("");
                      setLastError(null);
                    }}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Icon name="RiRefreshLine" className="w-4 h-4" />
                    Generate Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generation History */}
          {generationHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="RiHistoryLine" className="w-5 h-5" />
                  Recent Generations
                </CardTitle>
                <CardDescription>
                  Your recent video generations (up to 5 items)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generationHistory.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3 space-y-2">
                      <div className="aspect-video w-full overflow-hidden rounded border bg-muted/10">
                        <video
                          src={item.videoUrl}
                          className="h-full w-full object-cover"
                          preload="metadata"
                          muted
                          onClick={(e) => {
                            const video = e.target as HTMLVideoElement;
                            if (video.paused) {
                              video.play();
                            } else {
                              video.pause();
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            item.mode === 'firstLast' 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                          )}>
                            {item.mode === 'firstLast' ? 'First-Last' : 'Single'}
                          </span>
                          <span className="text-muted-foreground">
                            {item.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.prompt}
                        </p>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = item.videoUrl;
                              link.download = `genie3-video-${item.id}.mp4`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <Icon name="RiDownloadLine" className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => setGeneratedVideo(item.videoUrl)}
                          >
                            <Icon name="RiEyeLine" className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Upload Images</h4>
                    <p className="text-muted-foreground">
                      Upload your first frame image (required). Add a last frame image for precise control over the video's ending state and smoother transitions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Describe Effect</h4>
                    <p className="text-muted-foreground">
                      Describe in detail the video effect you want, including movement style, camera changes, etc.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Generate Video</h4>
                    <p className="text-muted-foreground">
                      Click the generate button, AI will create amazing video content based on your input
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}