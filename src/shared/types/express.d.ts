import { UserResponse } from "./types.ts";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserResponse;
    }
  }
}

export {};
