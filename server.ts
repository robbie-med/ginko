import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { apiRouter } from "./src/server-api.ts";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mount API endpoints
  app.use("/api", apiRouter);

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting developer server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting production build serving static files...");
    // Serve compiled client-side build
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));

    // Support SPA routing fallback
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting up on http://0.0.0.0:${PORT} ready.`);
  });
}

startServer();
