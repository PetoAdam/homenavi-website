export interface DemoStatus {
  reachable: boolean;
  checked_at: string;
}

export const DEMO_URL = "https://demo.homenavi.org";

export async function checkDemoStatus(): Promise<DemoStatus> {
  try {
    const res = await fetch(DEMO_URL, {
      next: { revalidate: 600 },
      signal: new AbortController().signal,
    });
    return { reachable: res.ok, checked_at: new Date().toISOString() };
  } catch {
    return { reachable: false, checked_at: new Date().toISOString() };
  }
}
