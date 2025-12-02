import { SessionOptions } from "iron-session";

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  userId: "",
  email: "",
  name: "",
  role: "user",
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "0ed8d38f5b01792ec28541a513fcefb3",
  cookieName: "yard_management_session",
  ttl: 60 * 60 * 24, // 1 day
  cookieOptions: {
    secure:
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_AUTH_URL?.startsWith("https"),
    sameSite: "lax", // CSRF protection
  },
};
