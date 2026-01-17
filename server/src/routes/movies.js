import { Router } from "express";
import { getMovieByTitle } from "../services/omdb.js";
import { findTitleIdByImdbId, getSourcesByTitleId } from "../services/watchmode.js";

const router = Router();

// GET /api/movies/search?title=Inception
router.get("/search", async (req, res) => {
  try {
    const title = req.query.title?.toString().trim();
    if (!title) return res.status(400).json({ error: "Missing query param: title" });

    // 1) OMDb lookup (like your first fetch)
    const omdb = await getMovieByTitle(title);

    // OMDb may return 200 but Response: "False"
    if (omdb.Response === "False") {
      return res.status(404).json({ error: "Movie not found", provider: "omdb", details: omdb.Error });
    }

    // 2) Watchmode: find its title id using imdb_id (most reliable)
    const titleId = await findTitleIdByImdbId(omdb.imdbID);

    // 3) Watchmode: get streaming sources/services
    const sources = titleId ? await getSourcesByTitleId(titleId) : [];

    // Return one combined payload to your frontend
    res.json({
      movie: omdb,
      watchmode: {
        titleId,
        sources
      }
    });
  } catch (err) {
    console.error(err);
    // 502 = upstream/provider error
    res.status(502).json({ error: "Upstream API error" });
  }
});

export default router;
