import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    const testConfig = {
        singleImageApp: {
            webappId: '1941035905484537857',
            apiKey: 'fb88fac46b0349c1986c9cbb4f14d44e',
            nodes: {
                image: "20",
                text: "21"
            }
        },
        firstLastFrameApp: {
            webappId: '1940960677383323649',
            apiKey: 'fb88fac46b0349c1986c9cbb4f14d44e',
            nodes: {
                firstImage: "193",
                lastImage: "194",
                prompt: "243"
            }
        }
    };

    return NextResponse.json({
        success: true,
        message: 'RunningHub configuration test',
        config: testConfig,
        timestamp: new Date().toISOString()
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        return NextResponse.json({
            success: true,
            message: 'Test endpoint received data',
            receivedData: body,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to parse request',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 400 });
    }
}