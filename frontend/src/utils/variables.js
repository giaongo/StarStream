const baseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:5001" : "/api";

const videoChatBaseUrl =
  process.env.NODE_ENV === "development" ? "localhost:5002" : "localhost:5002";
export { baseUrl, videoChatBaseUrl };
