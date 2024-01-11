import { Module } from "@nestjs/common";
import { EnvironmentModule } from "../environment/environment.module";
import { databaseFactory } from "./database.factory";

@Module({
    imports: [EnvironmentModule],
    providers: [
        {
            provide: "DATABASE_SERVICE",
            useFactory: databaseFactory,
            inject: ["DATABASE_PROVIDER", "MYSQL_CONFIG"],
        },
    ],
    exports: ["DATABASE_SERVICE"],
})
export class DatabaseModule {}
