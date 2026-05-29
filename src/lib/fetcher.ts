/** JSON fetcher for SWR — explicit `any` return so useSWR data is not inferred as `{}`. */
export const fetcher: (url: string) => Promise<any> = async (url) => {
  const res = await fetch(url);
  let data: unknown = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    const message =
      typeof data === 'object' && data !== null && 'error' in data && typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
};
