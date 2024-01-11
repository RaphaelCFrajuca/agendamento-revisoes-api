import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MysqlConfig } from "../database/mysql/interface/mysql-config.interface";

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: ".env" })],
    providers: [
        {
            provide: "DATABASE_PROVIDER",
            useValue: process.env.DATABASE_PROVIDER,
        },
        {
            provide: "MYSQL_CONFIG",
            useValue: {
                host: process.env.MYSQL_HOST,
                port: parseInt(process.env.MYSQL_PORT),
                username: process.env.MYSQL_USERNAME,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE_NAME,
            } as MysqlConfig,
        },
    ],
    exports: ["DATABASE_PROVIDER", "MYSQL_CONFIG"],
})
export class EnvironmentModule {}
