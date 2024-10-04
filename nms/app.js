import NodeMediaServer from "node-media-server";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { uploadFileToAWS } from "./awsS3Connect.js";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mediaPath = path.join(__dirname, "media");

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
    api: true,
  },
  trans: {
    ffmpeg: "/usr/bin/ffmpeg",
    tasks: [
      {
        app: "live",
        mp4: true,
        mp4Flags: "[movflags=flag_keyframe+empty_moov]",
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

nms.on("preConnect", (id, args) => {
  console.log(
    "[NodeEvent on preConnect]",
    `id=${id} args=${JSON.stringify(args)}`
  );

  // let session = nms.getSession(id);
  // session.reject();
});

nms.on("postConnect", (id, args) => {
  console.log(
    "[NodeEvent on postConnect]",
    `id=${id} args=${JSON.stringify(args)}`
  );
});

nms.on("doneConnect", (id, args) => {
  console.log(
    "[NodeEvent on doneConnect]",
    `id=${id} args=${JSON.stringify(args)}`
  );
});

nms.on("prePublish", (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on prePublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on("postPublish", (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on postPublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});

nms.on("donePublish", async (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on donePublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );

  const video_path = path.join(mediaPath, StreamPath);
  await uploadAndRemove(video_path);
});

nms.on("prePlay", (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on prePlay]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on("postPlay", (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on postPlay]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});

nms.on("donePlay", (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on donePlay]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});

nms.on("logMessage", (...args) => {
  // custom logger log message handler
});

nms.on("errorMessage", (...args) => {
  // custom logger error message handler
});

nms.on("debugMessage", (...args) => {
  // custom logger debug message handler
});

nms.on("ffDebugMessage", (...args) => {
  // custom logger ffmpeg debug message handler
});

/**
 * Upload mp4 file to S3 and remove ít from local storage
 */
const uploadAndRemove = async (video_path) => {
  // Upload file to S3
  fs.readdir(video_path, async (err, files) => {
    if (err) {
      console.error(err);
      return;
    } else {
      files.forEach(async (file) => {
        if (path.extname(file) === ".mp4") {
          await uploadFileToAWS(
            path.join(path.basename(video_path), file),
            path.join(video_path, file),
            video_path
          );
        }
      });
    }
  });
};
