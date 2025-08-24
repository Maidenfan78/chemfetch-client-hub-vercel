// src/app/api/debug-sds-parse-enhanced/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, sds_url, force = true, use_direct_parser = true } = body;

    if (!product_id || !sds_url) {
      return NextResponse.json({ error: 'Missing product_id or sds_url' }, { status: 400 });
    }

    // Get backend URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

    // Call the enhanced parser endpoint
    const response = await fetch(`${backendUrl}/parse-sds-enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: parseInt(product_id),
        sds_url,
        force,
        use_direct_parser,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: result.error || result.message || 'Enhanced parser failed',
          backend_status: response.status,
          backend_response: result,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Enhanced SDS parse debug error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'client_error',
      },
      { status: 500 }
    );
  }
}
