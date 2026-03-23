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
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findFirst({
      where: { email, isActive: true },
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

  async insertRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  async findValidRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async findNonRevokedRefreshByHash(tokenHash: string) {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null },
    });
  }

  async deleteRefreshToken(id: string) {
    return prisma.refreshToken.delete({
      where: { id },
    });
  }

  async revokeAllRefreshTokensForUser(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async findUserByIdForSession(userId: string) {
    return prisma.user.findFirst({
      where: { id: userId, isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        providerProfile: { select: { id: true } },
      },
    });
  }

  async findUserForPasswordReset(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        isActive: true,
        role: { in: ["CUSTOMER", "PROVIDER"] },
      },
      select: { id: true, email: true },
    });
  }

  async upsertPasswordResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    return prisma.passwordResetToken.upsert({
      where: { userId },
      create: { userId, tokenHash, expiresAt },
      update: { tokenHash, expiresAt },
    });
  }

  async findPasswordResetByTokenHash(tokenHash: string) {
    return prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        user: {
          select: { id: true, isActive: true, role: true },
        },
      },
    });
  }

  async completePasswordReset(
    userId: string,
    resetRowId: string,
    passwordHash: string,
  ) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.delete({ where: { id: resetRowId } }),
      prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
  }
}


