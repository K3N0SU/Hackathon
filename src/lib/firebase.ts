import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: "AIzaSyCJeRfRFt0RmrO_7Sr5wOOCEVvZfFjf5q4",
  authDomain: "furrow-422fa.firebaseapp.com",
  projectId: "furrow-422fa",
  appId: "1:721898935681:web:f35ba5c9c82f995e534480",
};

export function auth() {
  const app = getApps().length ? getApp() : initializeApp(config);
  return getAuth(app);
}
