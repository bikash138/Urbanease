import { AppError } from "../../common/errors/app.error";
import { ErrorCode } from "../../common/errors/error.types";
import { AuthRepository } from "./auth.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  type CreateSigninSchema,
  type CreateSignupSchema,
} from "./auth.validation";
import { env } from "../../config";

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async singupService(data: CreateSignupSchema) {
    const existingUser = await this.authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email already in use", 409, ErrorCode.CONFLICT);
    }
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.authRepository.createUser({
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: data.role,
    });

    return user;
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
