export function groupAndDedupeSources(sources = []) {
  const buckets = {
    sub: new Map(),
    free: new Map(),
    rentBuy: new Map(),
  };

  for (const s of sources) {
    const type = (s?.type ?? "").toLowerCase();
    const name = s?.name ?? "Unknown";
    const url = s?.web_url ?? s?.webUrl ?? s?.url ?? "";
    if (!url) continue;

    // Dedupe key: service name + url (you can also dedupe by service only if you prefer)
    const key = `${name}|||${url}`;

    if (type === "sub") buckets.sub.set(key, { ...s, name, url });
    else if (type === "free") buckets.free.set(key, { ...s, name, url });
    else if (type === "rent" || type === "buy") buckets.rentBuy.set(key, { ...s, name, url });
    // ignore other types for now (or add later)
  }

  return {
    subscription: Array.from(buckets.sub.values()),
    free: Array.from(buckets.free.values()),
    rentOrBuy: Array.from(buckets.rentBuy.values()),
  };
}