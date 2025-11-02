const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const jobs = {};
const storageDir = path.join(__dirname, "storage");
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir);

app.post("/api/create-job", (req, res) => {
  const { youtubeUrl, clipDurationMin, clipDurationMax, subtitleColor, subtitleCase } = req.body;
  if (!youtubeUrl) return res.status(400).json({ error: "YouTube URL is required" });

  const jobId = uuidv4();
  const jobData = { id: jobId, status: "pending", youtubeUrl, subtitleColor, subtitleCase };
  jobs[jobId] = jobData;

  const cmd = `node worker.js ${jobId}`;
  exec(cmd);

  res.json({ jobId });
});

app.get("/api/job/:id", (req, res) => {
  const job = jobs[req.params.id];
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => console.log("✅ ViralCut server rodando na porta 3000"));
