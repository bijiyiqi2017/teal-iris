import { Injectable, BadRequestException } from "@nestjs/common";
import { UsersService, User } from "../users/users.service.js";
import { JwtService } from "@nestjs/jwt";

export interface SafeUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  nativeLanguageId: string;
  targetLanguageId: string;
  bio?: string | null;
  timezone?: string | null;
  videoHandles: string[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // -----------------------
  // REGISTER
  // -----------------------
  async register(email: string, password: string, name?: string) {
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const user = await this.usersService.createUser(email, name);

    // If you later store passwordHash in DB, update it here.

    const safeUser = this.toSafeUser(user);

    return {
      accessToken: this.generateToken(safeUser),
      user: safeUser,
    };
  }

  // -----------------------
  // LOGIN
  // -----------------------
  async login(user: SafeUser) {
    return {
      accessToken: this.generateToken(user),
      user,
    };
  }

  // -----------------------
  // OAUTH VALIDATION
  // -----------------------
  async validateOAuthUser(email: string, name?: string): Promise<SafeUser> {
    let user: User | null = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.createUser(email, name);
    }

    return this.toSafeUser(user);
  }

  // -----------------------
  // HELPERS
  // -----------------------
  private generateToken(user: SafeUser) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      nativeLanguageId: user.nativeLanguageId,
      targetLanguageId: user.targetLanguageId,
      bio: user.bio ?? null,
      timezone: user.timezone ?? null,
      videoHandles: user.videoHandles ?? [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
