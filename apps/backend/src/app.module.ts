import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller.js"; // <--- important for ESM
import { AuthModule } from "./modules/auth/auth.module.js";
import { DbModule } from "./db/db.module.js";
import { HealthController } from "./modules/health/health.controller.js";
import { UsersModule } from "./modules/users/users.module.js";
import { ConnectionsModule } from "./modules/connections/connections.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    AuthModule,
    DbModule,
    UsersModule,
    ConnectionsModule,
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {}
