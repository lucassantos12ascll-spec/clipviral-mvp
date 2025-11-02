const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const jobId = process.argv[2];
const storageDir = path.join(__dirname, "storage", jobId);
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

const jobFile = path.join(storageDir, "job.json");
let jobData = { id: jobId, status: "downloading" };

fs.writeFileSync(jobFile, JSON.stringify(jobData, null, 2));

async function processVideo() {
  try {
    const info = await ytdl.getInfo(jobData.youtubeUrl);
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/g, "_");
    const videoPath = path.join(storageDir, `${videoTitle}.mp4`);

    const video = ytdl(jobData.youtubeUrl, { quality: "highest" });
    const writeStream = fs.createWriteStream(videoPath);
    video.pipe(writeStream);

    await new Promise((resolve) => writeStream.on("finish", resolve));
    jobData.status = "processing";
    fs.writeFileSync(jobFile, JSON.stringify(jobData, null, 2));

    const start = Math.floor(Math.random() * 120);
    const duration = 30 + Math.floor(Math.random() * 30);
    const clipPath = path.join(storageDir, `clip_${Date.now()}.mp4`);

    ffmpeg(videoPath)
      .setStartTime(start)
      .duration(duration)
      .videoFilters(`drawtext=text='ViralCut':fontcolor=${jobData.subtitleColor || "white"}:fontsize=24:x=(w-text_w)/2:y=h-50`)
      .output(clipPath)
      .on("end", () => {
        jobData.status = "done";
        jobData.output = clipPath;
        fs.writeFileSync(jobFile, JSON.stringify(jobData, null, 2));
        console.log("✅ Corte gerado:", clipPath);
      })
      .on("error", (err) => {
        jobData.status = "error";
        jobData.error = err.message;
        fs.writeFileSync(jobFile, JSON.stringify(jobData, null, 2));
        console.error("❌ Erro no corte:", err);
      })
      .run();
  } catch (err) {
    jobData.status = "error";
    jobData.error = err.message;
    fs.writeFileSync(jobFile, JSON.stringify(jobData, null, 2));
  }
}

processVideo();
