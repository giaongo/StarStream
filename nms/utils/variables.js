const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://backend:5001"
    : "http://frontend/api";

// TODO: Update cdnUrl
const cdnUrl = "https://d2svo8w7e6o53b.cloudfront.net";

export { baseUrl, cdnUrl };
