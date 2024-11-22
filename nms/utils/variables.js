// const baseUrl =
//   process.env.NODE_ENV === "development"
//     ? "http://backend:5001"
//     : "http://16.171.124.41/api";

const baseUrl = process.env.BACKEND_URL;

const whisperUrl = process.env.WHISPER_URL;

const cdnUrl = process.env.CDN_URL;

export { baseUrl, cdnUrl, whisperUrl };
