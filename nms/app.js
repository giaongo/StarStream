import NodeMediaServer from "node-media-server";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { uploadFileToAWS } from "./awsS3Connect.js";
import "dotenv/config";
import axios from "axios";
import { baseUrl, cdnUrl, whisperUrl } from "./utils/variables.js";
import { spawn } from "node:child_process";
import { fileFromPath } from "formdata-node/file-from-path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mediaPath = path.join(__dirname, "media");
const audioPath = path.join(__dirname, "audio");

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 4096,
    gop_cache: false,
    ping: 10,
    ping_timeout: 20,
  },
  http: {
    port: 8000,
    allow_origin: "*",
    mediaroot: "./media",
  },
  trans: {
    ffmpeg: "/usr/bin/ffmpeg",
    tasks: [
      {
        app: "live",
        ac: "aac",
        mp4: true,
        mp4Flags: "[movflags=faststart]",
        hls: true,
        hlsFlags:
          "[hls_time=1:hls_list_size=3:hls_flags=delete_segments+omit_endlist]",
        dash: true,
        dashFlags: "[f=dash:window_size=2:extra_window_size=4]",
      },
    ],
  },
};

var nms = new NodeMediaServer(config);
nms.run();

nms.on("donePublish", async (id, StreamPath, args) => {
  const streamVideoDirPath = path.join(mediaPath, StreamPath);
  // await uploadAndRemove(video_path);
  fs.readdir(streamVideoDirPath, async (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach(async (file) => {
      if (path.extname(file) === ".mp4") {
        const streamVideoFilePath = path.join(streamVideoDirPath, file);
        extractAudioFromVideo(streamVideoFilePath);
      }
    });
  });
});

/**
 * Upload video mp4 to S3, update the video data to the database via rest api and remove the video from media folder
 * @param {*} video_path
 */
const uploadAndRemove = async (video_path) => {
  fs.readdir(video_path, async (err, files) => {
    if (err) {
      console.error(err);
      return;
    } else {
      files.forEach(async (file) => {
        if (path.extname(file) === ".mp4") {
          try {
            const streaming_key = path.basename(video_path);
            const combined_name = path.join(streaming_key, file);
            const filePath = path.join(video_path, file);

            // upload video information to database
            const uploadToDBResult = await uploadVideoInfoToDB(
              `${cdnUrl}/${combined_name}`,
              streaming_key,
              combined_name
            );

            if (!uploadToDBResult) {
              throw new Error("Error uploading video information to database");
            }

            // upload file to AWS S3
            const uploadAWSResult = await uploadFileToAWS(
              combined_name,
              filePath
            );
            if (!uploadAWSResult) {
              throw new Error("Error uploading video to AWS S3");
            }

            // Remove file from local storage if upload to AWS S3 and database is successful
            if (fs.existsSync(filePath)) {
              // Remove file from local storage
              fs.unlink(filePath, (err) => {
                if (err) {
                  throw new Error("Error deleting file ", err);
                }
              });
              // Remove folder from local storage
              if (fs.existsSync(video_path)) {
                fs.rm(video_path, { recursive: true }, (err) => {
                  if (err) {
                    throw new Error("Error deleting folder ", err);
                  }
                });
              }
            }
            console.log("Upload and remove successful");
          } catch (error) {
            console.error("Error uploading and remove file: ", error);
          }
        }
      });
    }
  });
};

/**
 * Upload video information to database of main app backend
 * @param {*} video_url
 * @param {*} streaming_key
 * @returns
 */
const uploadVideoInfoToDB = async (video_url, streaming_key, combined_name) => {
  try {
    axios.post(baseUrl + "/events/archives", {
      video_url,
      streaming_key,
      combined_name,
    });
    return true;
  } catch (error) {
    throw new Error("Error uploading video information to database", error);
  }
};

/**
 * Extract audio from video file
 * @param {*} video_path
 */
const extractAudioFromVideo = (videoFilePath) => {
  if (!fs.existsSync(audioPath)) {
    fs.mkdirSync(audioPath);
  }
  const tempAudioFilePath = path.join(audioPath, "audio.mp3");
  runShellCommand(
    `ffmpeg -i ${videoFilePath} -q:a 0 -map a ${tempAudioFilePath}`,
    async () => await extractSubtitleFromAudio(tempAudioFilePath)
  );
};

/**
 * Generate subtitle from audio file
 * @param {*} audioFilePath
 */
const extractSubtitleFromAudio = async (audioFilePath) => {
  console.log("Extracting subtitle from audio file: ", audioFilePath);
  const formData = new FormData();
  formData.append("audio_file", await fileFromPath(audioFilePath));

  try {
    const result = await axios.post(
      path.join(
        whisperUrl,
        "asr?encode=true&task=transcribe&word_timestamps=false&output=vtt"
      ),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Extract subtitle from audio successful: ", result.data);
  } catch (error) {
    console.error("Error extracting subtitle from audio: ", error);
  }
};

/**
 * Execute linux shell command
 * @param {*} command
 * @returns
 */
const runShellCommand = (command, cb) => {
  const runCommand = spawn(command, { shell: true });
  runCommand.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  runCommand.on("close", async (code) => {
    if (code === 0) {
      console.log("Shell command executed successfully");
      if (cb) {
        await cb();
      }
    }
  });
};
