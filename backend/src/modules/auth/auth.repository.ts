import { prisma } from "../../../db";
import { createUserSlug } from "../../common/utils/slug-generator";
import { getDiceBearAvatarUrl } from "../../utils/avatar";
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

  async createCustomer(data: CreateSignupSchema, passwordHash: string) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    await tx.customerProfile.create({ data: { userId: user.id } });
    return { user };
  });
}

  async createProvider(data: CreateSignupSchema, passwordHash: string) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role: "PROVIDER",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      const profile = await tx.providerProfile.create({
        data: {
          userId: user.id,
          slug: createUserSlug(user.name, user.id),
          profileImage: getDiceBearAvatarUrl(user.id, user.name),
        },
        select: { id: true },
      });

      return {
        user,
        providerId: profile.id,
      };
    })
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
        providerProfile: { select: { id: true } },
      },
    });
  }
}
