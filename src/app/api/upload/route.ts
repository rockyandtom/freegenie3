import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'png'
    const filename = `${timestamp}.${extension}`

    // 将文件保存到public/uploads目录
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 确保uploads目录存在
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const filePath = join(uploadDir, filename)

    try {
      await writeFile(filePath, buffer)
    } catch (error) {
      // 如果写入失败，可能是目录不存在，创建目录后重试
      const { mkdir } = await import('fs/promises')
      await mkdir(uploadDir, { recursive: true })
      await writeFile(filePath, buffer)
    }

    console.log(`File uploaded: ${filename}`)

    return NextResponse.json({
      success: true,
      filename: filename,
      data: {
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}