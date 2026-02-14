<<<<<<< HEAD
// apps/backend/src/modules/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { LocalStrategy } from "./strategies/local.strategy.js";
import { JwtStrategy } from "./strategies/jwt.strategy.js";
import { GoogleStrategy } from "./strategies/google.strategy.js";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") ?? "fallback-secret",
        signOptions: {
          expiresIn: (configService.get<string>("JWT_EXPIRATION") ??
            "1h") as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
=======
import { UsersModule as _UsersModule } from "../users/users.module.js";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
>>>>>>> 9007d9f (chore(backend): fix ESLint config and clean lint errors)
})
export class AuthModule {}
