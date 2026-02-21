// apps/backend/src/modules/users/users.controller.ts
import {
  Controller,
  Get,
  Patch,
  Body,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { BrowseUsersQueryDto } from "./dto/browse-users-query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@Controller("users")
@UseGuards(JwtAuthGuard) // Protect all endpoints in this controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // --- Browse all users except current ---
  @Get()
  async browseUsers(@Request() req, @Query() query: BrowseUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return this.usersService.browseUsers(req.user.id, page, limit);
  }

  // --- Get current user profile ---
  @Get("me")
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  // --- Update current user profile ---
  @Patch("me")
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }
}
