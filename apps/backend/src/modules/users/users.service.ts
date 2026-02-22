import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq, ne, and, count } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../../db/schema.js";
import { DRIZZLE } from "../../db/db.module.js";
import { users, languages } from "../../db/schema.js";

export interface User {
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
export class UsersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  // -----------------------
  // FIND BY EMAIL
  // -----------------------
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) return null;

    return {
      ...user,
      videoHandles: user.videoHandles ?? [],
    };
  }

  // -----------------------
  // CREATE USER
  // -----------------------
  async createUser(email: string, name?: string): Promise<User> {
    const firstName = name?.split(" ")[0] ?? null;
    const lastName = name?.split(" ")[1] ?? null;

    const defaultLanguage = await this.db.query.languages.findFirst({
      where: eq(languages.code, "en"),
    });

    if (!defaultLanguage) {
      throw new Error("Default language 'en' not found in database");
    }

    const [newUser] = await this.db
      .insert(users)
      .values({
        email,
        passwordHash: "", // TODO: replace with hashed password if using credentials auth
        firstName,
        lastName,
        nativeLanguageId: defaultLanguage.id,
        targetLanguageId: defaultLanguage.id,
        bio: null,
        timezone: null,
        videoHandles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return {
      ...newUser,
      videoHandles: newUser.videoHandles ?? [],
    };
  }

  // -----------------------
  // PROFILE
  // -----------------------
  async getProfile(userId: string): Promise<User> {
    const profile = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!profile) {
      throw new NotFoundException("User profile not found");
    }

    return {
      ...profile,
      videoHandles: profile.videoHandles ?? [],
    };
  }

  async updateProfile(
    userId: string,
    dto: Partial<typeof users.$inferInsert>,
  ): Promise<User> {
    const [updatedUser] = await this.db
      .update(users)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new NotFoundException("User profile not found");
    }

    return {
      ...updatedUser,
      videoHandles: updatedUser.videoHandles ?? [],
    };
  }

  // -----------------------
  // BROWSE USERS
  // -----------------------
  async browseUsers(currentUserId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const whereClause = and(ne(users.id, currentUserId));

    const [data, [{ totalCount }]] = await Promise.all([
      this.db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          bio: users.bio,
          timezone: users.timezone,
          videoHandles: users.videoHandles,
          nativeLanguageId: users.nativeLanguageId,
          targetLanguageId: users.targetLanguageId,
        })
        .from(users)
        .where(whereClause)
        .limit(limit)
        .offset(offset),

      this.db.select({ totalCount: count() }).from(users).where(whereClause),
    ]);

    return {
      data: data.map((u) => ({
        ...u,
        videoHandles: u.videoHandles ?? [],
      })),
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}
