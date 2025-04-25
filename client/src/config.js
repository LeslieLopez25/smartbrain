// If there's an environment variable set for the base URL (e.g., in production),
// use that. Otherwise, default to your local backend server.
export const API_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:3001";
