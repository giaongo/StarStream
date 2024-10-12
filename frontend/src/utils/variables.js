// const baseUrl = "http://localhost:5001";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "http://localhost/api";
export { baseUrl };
