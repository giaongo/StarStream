const baseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:5001" : "/api";

const videoChatBaseUrl =
  process.env.NODE_ENV === "development"
    ? "localhost:5002"
    : "16.170.129.30:5002";
export { baseUrl, videoChatBaseUrl };
