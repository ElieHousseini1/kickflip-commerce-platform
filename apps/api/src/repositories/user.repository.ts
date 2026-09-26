import type { Transaction } from "sequelize";
import { User } from "../database/models/index.js";

export const userRepository = {
  findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  },

  findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email: email.trim().toLowerCase() } });
  },

  create(
    values: Pick<User, "id" | "name" | "email" | "passwordHash">,
    transaction?: Transaction,
  ): Promise<User> {
    return User.create(values, transaction ? { transaction } : {});
  },
};
