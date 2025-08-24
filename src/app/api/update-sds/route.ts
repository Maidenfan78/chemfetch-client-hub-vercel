// src/app/api/update-sds/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { productId, pdfUrl } = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 300_000); // 5 minutes

    const resp = await fetch(`${backendUrl}/parse-sds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Backend expects { product_id, sds_url, force }
      body: JSON.stringify({
        product_id: parseInt(productId),
        sds_url: pdfUrl,
        force: false,
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
      data = { raw: text };
    }
    const parsedData = data as Record<string, unknown>;

    if (!resp.ok) {
      const errorMessage =
        (parsedData.error as string) || (parsedData.raw as string) || 'Failed to trigger parse';
      return NextResponse.json({ error: errorMessage }, { status: resp.status });
    }

    // bubble up parsed fields so the UI can refresh row(s)
    return NextResponse.json({ success: true, ...parsedData });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
