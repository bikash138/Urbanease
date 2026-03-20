import { AppError } from "../../common/errors/app.error";
import { ErrorCode } from "../../common/errors/error.types";
import { AuthRepository } from "./auth.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  type CreateSigninSchema,
  type CreateSignupSchema,
  type CreateAdminSigninSchema,
} from "./auth.validation";
import { env } from "../../config";

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

    const payload: Record<string, unknown> = {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    };
    if (result.providerId) {
      payload.providerId = result.providerId;
    }

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    return {
      token,
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
    if (user?.role === "ADMIN") {
      throw new AppError(
        "Admins must use the admin signin route",
        401,
        ErrorCode.FORBIDDEN,
      );
    }
    if (!user) {
      throw new AppError(
        "Invalid Credentials",
        401,
        ErrorCode.INVALID_CREDENTIALS,
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

    const payload: Record<string, unknown> = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    if (user.role === "PROVIDER" && user.providerProfile) {
      payload.providerId = user.providerProfile.id;
    }

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    return {
      token,
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

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
