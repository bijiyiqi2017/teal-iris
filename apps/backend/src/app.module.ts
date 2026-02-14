import { Module } from "@nestjs/common";
import { HealthController } from "./modules/health/health.controller.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { DbModule } from "./db/db.module.js";
import { AppController } from "./app.controller.js";

@Module({
  imports: [AuthModule, DbModule],
  controllers: [HealthController, AppController],
})
export class AppModule {}
