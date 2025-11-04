import express from "express";
const app = express();

app.use(express.static("public")); // serve files in server/public

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.send(`<h1>Node is up (behind nginx)</h1><p>Try <code>/api/health</code></p>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Node on ${PORT}`));