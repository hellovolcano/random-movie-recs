async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function searchMovie(title) {
  const q = title?.trim();
  if (!q) throw new Error("Please enter a movie title.");

  const res = await fetch(`/api/movies/search?title=${encodeURIComponent(q)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "omit",
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }

  return data; // { movie, watchmode: { titleId, sources } }
}

export async function getServiceNamesByRegion(region = "US") {
  const res = await fetch(`/api/sources/${encodeURIComponent(region)}`, {
    headers: { Accept: "application/json" },
    credentials: "omit",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status})`);

  return data.services ?? [];
}

