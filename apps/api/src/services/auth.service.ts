import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { UniqueConstraintError } from "sequelize";
import type { LoginInput, RegisterInput } from "../contracts/auth.contract.js";
import { AppError } from "../errors/app-error.js";
import { userRepository } from "../repositories/user.repository.js";
import { serializeUser } from "../serializers/user.serializer.js";

export const authService = {
  async login(input: LoginInput) {
    const account = await userRepository.findByEmail(input.email);
    if (
      !account ||
      !(await bcrypt.compare(input.password, account.passwordHash))
    ) {
      throw new AppError("The email or password you entered is incorrect.", {
        status: 401,
        code: "INVALID_CREDENTIALS",
      });
    }
    return serializeUser(account);
  },

  async register(input: RegisterInput) {
    if (await userRepository.findByEmail(input.email)) {
      throw new AppError("An account with this email already exists.", {
        status: 409,
        code: "EMAIL_EXISTS",
      });
    }

    try {
      const account = await userRepository.create({
        id: randomUUID(),
        name: input.name,
        email: input.email,
        passwordHash: await bcrypt.hash(input.password, 12),
      });
      return serializeUser(account);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new AppError("An account with this email already exists.", {
          status: 409,
          code: "EMAIL_EXISTS",
        });
      }
      throw error;
    }
  },
};
