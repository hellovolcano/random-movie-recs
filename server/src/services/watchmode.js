function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const WATCHMODE_API_KEY = requireEnv("WATCHMODE_API_KEY");
const WATCHMODE_BASE_URL = "https://api.watchmode.com/v1";

// ---- TTL cache ----
const SOURCES_CACHE = new Map(); // region -> { expiresAt, services }
const TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

async function fetchJson(url) {
  const res = await fetch(url);

  const text = await res.text().catch(() => "");
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // not json
  }

  if (!res.ok) {
    throw new Error(`Watchmode error ${res.status}: ${text || res.statusText}`);
  }

  // Some APIs return error payloads with 200; catch that too:
  if (json && (json.error || json.errors || json.status === "error" || json.success === false)) {
    throw new Error(`Watchmode returned error payload: ${text.slice(0, 300)}`);
  }

  return json;
}

// Step 2: Find Watchmode title id by imdb_id
// Watchmode has a "search" endpoint that can match external ids.
// We'll use it to locate the title id reliably.
export async function findTitleIdByImdbId(imdbId) {
  // This endpoint is commonly used to search titles.
  // If Watchmode changes their API shape, adjust this one function.
  const url = new URL(`${WATCHMODE_BASE_URL}/search/`);
  url.searchParams.set("apiKey", WATCHMODE_API_KEY);
  url.searchParams.set("search_field", "imdb_id");
  url.searchParams.set("search_value", imdbId);

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Watchmode search HTTP ${resp.status}`);

  const json = await resp.json();

  // Depending on Watchmode response shape, pick first result.
  const first = json?.title_results?.[0];
  return first?.id ?? null;
}

// Step 3: Get sources for a Watchmode title id (your original queryServices)
export async function getSourcesByTitleId(titleId) {
  const url = new URL(`${WATCHMODE_BASE_URL}/title/${titleId}/sources/`);
  url.searchParams.set("apiKey", WATCHMODE_API_KEY);

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Watchmode sources HTTP ${resp.status}`);

  return resp.json();
};


export async function getServiceNamesByRegion(region) {
  const r = String(region).trim().toUpperCase();
  const now = Date.now();


  const cached = SOURCES_CACHE.get(r);
  if (cached && cached.expiresAt > now) return cached.services;

  const url =
    `${WATCHMODE_BASE_URL}/sources?regions=${encodeURIComponent(r)}` +
    `&apiKey=${WATCHMODE_API_KEY}`;

  const payload = await fetchJson(url);

  // Since your log shows it's an array:
  const list = Array.isArray(payload) ? payload : [];

  const services = Array.from(
    new Set(list.map((s) => s?.name).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  // Re-enable caching AFTER it works
  if (services.length > 0) {
    SOURCES_CACHE.set(r, { expiresAt: now + TTL_MS, services });
  }

  return services;
}


