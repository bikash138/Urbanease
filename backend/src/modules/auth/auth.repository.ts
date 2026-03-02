import { prisma } from "../../../db";
import type { CreateSigninSchema, CreateSignupSchema } from "./auth.validation";

export class AuthRepository {
  async createSignin(data: CreateSigninSchema) {
    return await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        passwordHash: true,
      },
    });
  }
  async createUser(data: CreateSignupSchema) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.password,
        role: data.role,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
      },
    });
  }
}
