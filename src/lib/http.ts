// src/lib/http.ts
// Shared HTTP utilities for resilient backend calls (Render wake + JSON-safe parsing)

export type FetchJsonResult<T = any> = {
  ok: boolean;
  status: number;
  json: T | null;
  text: string;
  contentType: string | null;
};

async function parseJsonSafe(text: string): Promise<any | null> {
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Fetch JSON with handling for Render free dyno hibernation (503 + empty body).
 * If encountered, pings the backend health endpoint to wake it, waits briefly, and retries once.
 */
export async function fetchJsonWithWake(
  url: string,
  init?: RequestInit,
  wakeUrl?: string
): Promise<FetchJsonResult> {
  const doFetch = async (): Promise<FetchJsonResult> => {
    const res = await fetch(url, init);
    const status = res.status;
    const contentType = res.headers.get('content-type');
    let text = '';
    try {
      text = await res.text();
    } catch {
      text = '';
    }
    const json = await parseJsonSafe(text);
    return { ok: res.ok, status, json, text, contentType };
  };

  // First attempt
  let result = await doFetch();

  // Wake + retry on Render 503 with empty body
  if (result.status === 503 && (!result.text || result.text.trim() === '')) {
    if (wakeUrl) {
      try {
        await fetch(wakeUrl, { method: 'GET' }).catch(() => {});
      } catch {}
    }
    // small backoff then retry once
    await new Promise(r => setTimeout(r, 1200));
    result = await doFetch();
  }

  return result;
}
