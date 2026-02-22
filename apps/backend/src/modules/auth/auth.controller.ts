import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import { AuthService } from "./auth.service.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =========================
  // REGISTER
  // =========================
  @Post("register")
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      name?: string;
    },
  ) {
    const { email, password, name } = body;

    return this.authService.register(email, password, name);
  }

  // =========================
  // VERIFY EMAIL
  // =========================
  @Get("verify-email")
  async verifyEmail(@Query("token") token: string) {
    return this.authService.verifyEmail(token);
  }
}
