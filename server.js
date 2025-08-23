import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ping endpoint
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Download endpoint (default 10 MB)
app.get("/download", (req, res) => {
  let size = parseInt(req.query.size) || 10_000_000;
  let buffer = Buffer.alloc(size, "a");
  res.set("Content-Type", "application/octet-stream");
  res.send(buffer);
});

// Upload endpoint (max 200 MB)
app.post("/upload", express.raw({ type: "*/*", limit: "200mb" }), (req, res) => {
  res.send("ok");
});

app.listen(PORT, () => {
  console.log(`MP SPEEDTEST backend pyörii portissa ${PORT}`);
});
