export interface FetchResult {
  data: unknown | null;
  error?: string;
}

export async function fetchJsonFromUrl(url: string): Promise<FetchResult> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorMsg = `HTTP error! status: ${response.status}`;
      return { data: null, error: errorMsg };
    }

    const data = await response.json();

    return { data, error: undefined };
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error fetching data";
    return { data: null, error: errorMsg };
  }
}
