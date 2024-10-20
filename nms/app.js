import NodeMediaServer from "node-media-server";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { uploadFileToAWS } from "./utils/awsS3Connect.js";
import "dotenv/config";
import axios from "axios";
import { cdnUrl, whisperUrl, baseUrl } from "./utils/variables.js";
import { fileFromPath } from "formdata-node/file-from-path";
import { clearTemp, runShellCommand } from "./utils/utilFunctions.js";

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
let subtitleFilePath = "";
nms.run();

// Call back when stream has stopped
nms.on("donePublish", async (id, StreamPath, args) => {
  const streamingKey = path.basename(StreamPath);
  const streamVideoDirPath = path.join(mediaPath, StreamPath);
  fs.readdir(streamVideoDirPath, async (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach(async (file) => {
      if (path.extname(file) === ".mp4") {
        // extract audio from video after the streaming ended for 1s
        const streamVideoFilePath = path.join(streamVideoDirPath, file);
        setTimeout(() => {
          extractAudioFromVideo(streamVideoFilePath, streamingKey);
        }, 1000);
      }
    });
  });
});

/**
 * Extract audio from video file
 * @param {*} video_path
 */
const extractAudioFromVideo = (videoFilePath, streamingKey) => {
  if (!fs.existsSync(audioPath)) {
    fs.mkdirSync(audioPath);
  }
  const tempAudioFilePath = path.join(
    audioPath,
    `${path.parse(videoFilePath).name}.mp3`
  );

  // execute ffmpeg audio extraction command
  runShellCommand(
    `ffmpeg -i ${videoFilePath} -q:a 0 -map a ${tempAudioFilePath}`,
    async () => {
      try {
        subtitleFilePath = await extractSubtitleFromAudio(tempAudioFilePath);
        const combinedDirVideoFilename = path.join(
          streamingKey,
          path.basename(videoFilePath)
        );
        const combinedDirSubtitleFilename = path.join(
          streamingKey,
          path.basename(subtitleFilePath)
        );
        const cdnVideoPath = `${cdnUrl}/${combinedDirVideoFilename}`;
        const cdnSubtitlePath = `${cdnUrl}/${combinedDirSubtitleFilename}`;

        // Upload data to backend DB
        const uploadToDBResult = await uploadVideoInfoToDB(
          cdnVideoPath,
          streamingKey,
          combinedDirVideoFilename,
          cdnSubtitlePath
        );
        console.log("Upload to DB result: ", uploadToDBResult);
        if (!uploadToDBResult) {
          throw new Error("Error upload video to backend");
        }
        // Upload video and subtitle AWS S3
        const uploadAWSAllResult = await Promise.all([
          uploadFileToAWS(combinedDirVideoFilename, videoFilePath),
          uploadFileToAWS(combinedDirSubtitleFilename, subtitleFilePath),
        ]);

        if (!uploadAWSAllResult) {
          throw new Error("Error uploading video and subtitle file to AWS S3");
        }

        // Remove video file if upload to AWS S3 and database is successful
        clearTemp(path.dirname(videoFilePath));

        // Remove audio folder if upload to AWS S3 and database is successful
        clearTemp(audioPath);
      } catch (error) {
        console.error("Error extracting audio from video: ", error);
      }
    }
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

    // store the result into the vtt file
    const vttFilePath = path.join(
      audioPath,
      `${path.parse(audioFilePath).name}.vtt`
    );

    console.log("Extracting result ", result);

    // write the result to vtt file
    fs.writeFileSync(vttFilePath, result.data, (err) => {
      if (err) {
        throw new Error("Error writing subtitle to file: ", err);
      }
    });

    return vttFilePath;
  } catch (error) {
    console.error("Error extracting subtitle from audio: ", error);
  }
};

/**
 * Upload video information to database
 * @param {*} video_url
 * @param {*} streaming_key
 * @param {*} combined_name
 * @param {*} subtitle_url
 * @returns
 */
const uploadVideoInfoToDB = async (
  video_url,
  streaming_key,
  combined_name,
  subtitle_url
) => {
  try {
    await axios.post(baseUrl + "/events/archives", {
      video_url,
      streaming_key,
      combined_name,
      subtitle_url,
    });
    return true;
  } catch (error) {
    throw new Error("Error uploading video information to database", error);
  }
};
