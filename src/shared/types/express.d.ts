import { JwtUserPayload } from "./types.ts";

declare global {
  namespace Express {
    interface Request {
      currentUser?: JwtUserPayload;
    }
  }
}

export {};
