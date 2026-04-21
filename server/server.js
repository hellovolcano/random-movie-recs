import express from 'express';
import "dotenv/config";
import moviesRouter from './src/routes/movies.js';
import sourcesRouter from './src/routes/sources.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ?? 3000;

app.disable("x-powered-by");
app.use(express.json());

// Routes
app.use("/api/movies", moviesRouter);
app.use("/api/sources", sourcesRouter);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "..", "client", "build")));
    app.get("/", (_req, res) => {
        res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
