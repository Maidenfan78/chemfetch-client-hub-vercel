// src/app/api/debug-sds-parse/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { product_id, sds_url, force } = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    if (!sds_url) {
      return NextResponse.json({ error: 'SDS URL is required for debugging' }, { status: 400 });
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 300_000); // 5 minutes

    // Make the request to the backend with debug flag
    const resp = await fetch(`${backendUrl}/parse-sds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: parseInt(product_id),
        sds_url: sds_url,
        force: force || true,
        debug: true, // Add debug flag if backend supports it
      }),
      signal: controller.signal,
    }).catch(e => {
      throw new Error(e?.name === 'AbortError' ? 'Parse timed out' : String(e));
    });

    clearTimeout(id);

    const text = await resp.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw_response: text, parse_error: 'Failed to parse JSON response' };
    }
    const responseData = data as Record<string, unknown>;

    // Always return the full response for debugging, even if backend returned an error
    const debugResponse: Record<string, unknown> = {
      success: resp.ok,
      status_code: resp.status,
      backend_url: `${backendUrl}/parse-sds`,
      request_payload: { product_id: parseInt(product_id), sds_url, force, debug: true },
      response_data: responseData,
      timestamp: new Date().toISOString(),
    };

    if (!resp.ok) {
      const parsed = responseData as {
        error?: string;
        raw_response?: string;
      };
      debugResponse.error = parsed.error || parsed.raw_response || 'Backend request failed';
    }

    return NextResponse.json(debugResponse);
  } catch (error) {
    const debugResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      debug: true,
    };

    return NextResponse.json(debugResponse, { status: 500 });
  }
}
