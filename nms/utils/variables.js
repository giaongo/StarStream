const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://backend:5001"
    : "http://frontend/api";

const whisperUrl =
  process.env.NODE_ENV === "development"
    ? "http://whisper:9000"
    : "http://whisper:9000";

// TODO: Update cdnUrl
const cdnUrl = "https://d2svo8w7e6o53b.cloudfront.net";

export { backendUrl as baseUrl, cdnUrl, whisperUrl };
