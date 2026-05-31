/** Browser-like defaults — avoids 403 from edge bot protection on k6's default UA. */
export const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
};

export const JSON_HEADERS = {
  ...BROWSER_HEADERS,
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/json',
};

export const FORM_HEADERS = {
  ...BROWSER_HEADERS,
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/x-www-form-urlencoded',
};

/** Merge tags + headers into a k6 request params object. */
export function reqParams({ tags, jar, headers, timeout, redirects } = {}) {
  return {
    ...(tags ? { tags } : {}),
    ...(jar ? { jar } : {}),
    ...(timeout ? { timeout } : {}),
    ...(redirects !== undefined ? { redirects } : {}),
    headers: { ...BROWSER_HEADERS, ...headers },
  };
}
