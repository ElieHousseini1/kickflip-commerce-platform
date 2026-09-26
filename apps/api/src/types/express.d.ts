import type { User } from "../database/models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
