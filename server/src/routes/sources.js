import { Router } from "express";
import { getServiceNamesByRegion } from "../services/watchmode.js";

const router = Router();

// GET /api/sources/search
router.get("/:region", async (req, res) => {
  try {
    const { region } = req.params;

    const services = await getServiceNamesByRegion(region); // <-- already a string[]

    return res.json({
      region: region.toUpperCase(),
      services, // <-- send it directly
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to fetch sources" });
  }
});


export default router;
