const OMDB_BASE_URL = "https://www.omdbapi.com/";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const OMDB_API_KEY = requireEnv("OMDB_API_KEY");

export async function getMovieByTitle(title) {
  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("apikey", OMDB_API_KEY);
  url.searchParams.set("t", title);
  url.searchParams.set("type", "movie");

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`OMDb HTTP ${resp.status}`);

  return resp.json();
}
