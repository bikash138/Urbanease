import { AppError } from "../../common/errors/app.error";
import { ErrorCode } from "../../common/errors/error.types";
import { AuthRepository } from "./auth.repository";
import bcrypt from "bcrypt";
import {
  type CreateSigninSchema,
  type CreateSignupSchema,
  type CreateAdminSigninSchema,
} from "./auth.validation";
import { env } from "../../config";
import {
  accessExpiresInSeconds,
  createRefreshTokenValue,
  hashRefreshToken,
  refreshTokenExpiresAt,
  signAccessToken,
  type AccessTokenPayload,
} from "../../utils/tokens";

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
    const rawRefreshToken = createRefreshTokenValue();
    const tokenHash = hashRefreshToken(rawRefreshToken);
    const expiresAt = refreshTokenExpiresAt();

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
    const rawRefreshToken = createRefreshTokenValue();

    const tokenHash = hashRefreshToken(rawRefreshToken);
    const expiresAt = refreshTokenExpiresAt();

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
    const rawRefreshToken = createRefreshTokenValue();
    const tokenHash = hashRefreshToken(rawRefreshToken);
    const expiresAt = refreshTokenExpiresAt();

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
    const tokenHash = hashRefreshToken(rawRefreshToken);
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
    const newRawRefresh = createRefreshTokenValue();
    const newHash = hashRefreshToken(newRawRefresh);
    const expiresAt = refreshTokenExpiresAt();
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

  async signoutService(rawRefreshToken: string | undefined) {
    const raw = rawRefreshToken?.trim();
    if (!raw) return;
    const tokenHash = hashRefreshToken(raw);
    const row =
      await this.authRepository.findNonRevokedRefreshByHash(tokenHash);
    if (row) {
      await this.authRepository.deleteRefreshToken(row.id);
    }
  }
}
