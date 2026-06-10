import axios from "axios";

const getBaseURL = () => {
  // Server-side: must be an absolute URL
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || "https://faithwedsjoe2026.com.ng";
  }
  // Client-side: derive from the current page's origin so it works on
  // localhost, staging, and production without any env var needed
  return window.location.origin;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});