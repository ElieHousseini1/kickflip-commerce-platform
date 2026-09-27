import { createHash } from "node:crypto";
import { Op } from "sequelize";
import { Session } from "../database/models/session.model.js";

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const sessionRepository = {
  async create(token: string, userId: string, expiresAt: Date): Promise<void> {
    await Session.create({ tokenHash: tokenHash(token), userId, expiresAt });
  },

  async findActive(token: string, userId: string): Promise<boolean> {
    return Boolean(
      await Session.findOne({
        where: {
          tokenHash: tokenHash(token),
          userId,
          expiresAt: { [Op.gt]: new Date() },
        },
      }),
    );
  },

  async revoke(token: string): Promise<void> {
    await Session.destroy({ where: { tokenHash: tokenHash(token) } });
  },
};
