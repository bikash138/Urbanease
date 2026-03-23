import { AppError } from "../../common/errors/app.error";
import { ErrorCode } from "../../common/errors/error.types";
import { AuthRepository } from "./auth.repository";
import bcrypt from "bcrypt";
import {
  type CreateSigninSchema,
  type CreateSignupSchema,
  type CreateAdminSigninSchema,
  type ForgotPasswordSchema,
  type ResetPasswordSchema,
} from "./auth.validation";
import { env } from "../../config";
import {
  accessExpiresInSeconds,
  createRandomToken,
  hashTokenWithSecret,
  PASSWORD_RESET_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
  signAccessToken,
  type AccessTokenPayload,
} from "../../utils/tokens";
import { sendPasswordResetEmail } from "../../lib/email";
import { logger } from "../../lib/logger";

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async signupService(data: CreateSignupSchema) {
    const existingUser = await this.authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email already in use", 409, ErrorCode.CONFLICT);
    }
    const passwordHash = await bcrypt.hash(data.password, 10);

    let result: {
      user: { id: string; name: string; email: string; role: string };
      providerId?: string;
    };

    if (data.role === "CUSTOMER") {
      result = await this.authRepository.createCustomer(data, passwordHash);
    } else {
      result = await this.authRepository.createProvider(data, passwordHash);
    }

    const payload: AccessTokenPayload = {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role as AccessTokenPayload["role"],
      ...(result.providerId ? { providerId: result.providerId } : {}),
    };

    const accessToken = signAccessToken(payload);
    const rawRefreshToken = createRandomToken();
    const tokenHash = hashTokenWithSecret(
      rawRefreshToken,
      env.REFRESH_TOKEN_SECRET,
    );
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await this.authRepository.insertRefreshToken(
      result.user.id,
      tokenHash,
      expiresAt,
    );

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      accessExpiresInSeconds: accessExpiresInSeconds(accessToken),
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    };
  }

  async signinService(data: CreateSigninSchema) {
    const user = await this.authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError(
        "Invalid Credentials",
        401,
        ErrorCode.INVALID_CREDENTIALS,
      );
    }

    if (user.role === "ADMIN") {
      throw new AppError(
        "Admins must use the admin signin route",
        401,
        ErrorCode.FORBIDDEN,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new AppError(
        "Invalid Credentials",
        401,
        ErrorCode.INVALID_CREDENTIALS,
      );
    }

    const payload: AccessTokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role as AccessTokenPayload["role"],
      ...(user.role === "PROVIDER" && user.providerProfile
        ? { providerId: user.providerProfile.id }
        : {}),
    };

    const accessToken = signAccessToken(payload);
    const rawRefreshToken = createRandomToken();

    const tokenHash = hashTokenWithSecret(
      rawRefreshToken,
      env.REFRESH_TOKEN_SECRET,
    );
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await this.authRepository.insertRefreshToken(user.id, tokenHash, expiresAt);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      accessExpiresInSeconds: accessExpiresInSeconds(accessToken),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async adminSigninService(data: CreateAdminSigninSchema) {
    // Verify the adminKey
    if (data.adminKey !== env.ADMIN_KEY) {
      throw new AppError(
        "Access denied: invalid admin key",
        403,
        ErrorCode.FORBIDDEN,
      );
    }

    const user = await this.authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError(
        "Invalid Credentials",
        401,
        ErrorCode.INVALID_CREDENTIALS,
      );
    }

    if (user.role !== "ADMIN") {
      throw new AppError(
        "Access denied: not an admin account",
        403,
        ErrorCode.FORBIDDEN,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new AppError(
        "Invalid Credentials",
        401,
        ErrorCode.INVALID_CREDENTIALS,
      );
    }

    const payload: AccessTokenPayload = {
      id: user.id,
      email: user.email,
      role: "ADMIN",
    };

    const accessToken = signAccessToken(payload);
    const rawRefreshToken = createRandomToken();
    const tokenHash = hashTokenWithSecret(
      rawRefreshToken,
      env.REFRESH_TOKEN_SECRET,
    );
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await this.authRepository.insertRefreshToken(user.id, tokenHash, expiresAt);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      accessExpiresInSeconds: accessExpiresInSeconds(accessToken),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshSessionService(rawRefreshToken: string) {
    if (!rawRefreshToken?.trim()) {
      throw new AppError("Refresh token missing", 401, ErrorCode.UNAUTHORIZED);
    }
    const tokenHash = hashTokenWithSecret(
      rawRefreshToken,
      env.REFRESH_TOKEN_SECRET,
    );
    const row = await this.authRepository.findValidRefreshToken(tokenHash);
    if (!row) {
      throw new AppError("Invalid refresh token", 401, ErrorCode.UNAUTHORIZED);
    }
    await this.authRepository.deleteRefreshToken(row.id);
    const user = await this.authRepository.findUserByIdForSession(row.userId);
    if (!user) {
      throw new AppError("Unauthorized", 401, ErrorCode.UNAUTHORIZED);
    }
    const payload: AccessTokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role as AccessTokenPayload["role"],
      ...(user.role === "PROVIDER" && user.providerProfile
        ? { providerId: user.providerProfile.id }
        : {}),
    };
    const accessToken = signAccessToken(payload);
    const newRawRefresh = createRandomToken();
    const newHash = hashTokenWithSecret(
      newRawRefresh,
      env.REFRESH_TOKEN_SECRET,
    );
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await this.authRepository.insertRefreshToken(user.id, newHash, expiresAt);
    return {
      accessToken,
      refreshToken: newRawRefresh,
      accessExpiresInSeconds: accessExpiresInSeconds(accessToken),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async requestForgotPassword(data: ForgotPasswordSchema) {
    const user = await this.authRepository.findUserForPasswordReset(data.email);
    if (!user) return;

    const raw = createRandomToken();
    const tokenHash = hashTokenWithSecret(raw, env.PASSWORD_RESET_SECRET);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

    await this.authRepository.upsertPasswordResetToken(
      user.id,
      tokenHash,
      expiresAt,
    );

    const resetLink = `${env.FRONTEND_URL.replace(/\/$/, "")}/auth/reset-password?token=${encodeURIComponent(raw)}`;
    console.log("RESET LINK", resetLink)
    try {
      await sendPasswordResetEmail(user.email, resetLink);
    } catch (err) {
      logger.error({ err }, "Password reset email failed");
    }
  }

  async resetPasswordService(data: ResetPasswordSchema) {
    const tokenHash = hashTokenWithSecret(data.token, env.PASSWORD_RESET_SECRET);
    const row =
      await this.authRepository.findPasswordResetByTokenHash(tokenHash);

    if (!row) {
      throw new AppError(
        "This reset link is invalid",
        400,
        ErrorCode.NOT_FOUND,
      );
    }

    if (row.expiresAt < new Date()) {
      throw new AppError(
        "This reset link has expired",
        400,
        ErrorCode.TOKEN_EXPIRED,
      );
    }

    if (!row.user.isActive) {
      throw new AppError(
        "This account is not active",
        403,
        ErrorCode.FORBIDDEN,
      );
    }

    if (row.user.role !== "CUSTOMER" && row.user.role !== "PROVIDER") {
      throw new AppError(
        "Admin reset not allowed",
        403,
        ErrorCode.FORBIDDEN,
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    await this.authRepository.completePasswordReset(
      row.userId,
      row.id,
      passwordHash,
    );
  }

  async signoutService(rawRefreshToken: string | undefined) {
    const raw = rawRefreshToken?.trim();
    if (!raw) return;
    const tokenHash = hashTokenWithSecret(raw, env.REFRESH_TOKEN_SECRET);
    const row =
      await this.authRepository.findNonRevokedRefreshByHash(tokenHash);
    if (row) {
      await this.authRepository.deleteRefreshToken(row.id);
    }
  }
}
