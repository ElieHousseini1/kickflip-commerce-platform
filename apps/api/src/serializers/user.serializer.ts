import type { User } from "../database/models/index.js";
import type { SessionUserDto } from "../types/domain.js";

export function serializeUser(user: User): SessionUserDto {
  return { id: user.id, name: user.name, email: user.email };
}
