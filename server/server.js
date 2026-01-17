import express from 'express';
import "dotenv/config";
import moviesRouter from './src/routes/movies.js';
import sourcesRouter from './src/routes/sources.js'

const app = express();
const PORT = process.env.PORT ?? 3000;

app.disable("x-powered-by");
app.use(express.json());

// Routes
app.use("/api/movies", moviesRouter);
app.use("/api/sources", sourcesRouter);

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});