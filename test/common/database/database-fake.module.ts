import { Module } from "@nestjs/common";
import { EnvironmentModuleFake } from "../environment/environment-fake.module";
import { databaseFactoryFake } from "./database-fake.factory";

@Module({
    imports: [EnvironmentModuleFake],
    providers: [
        {
            provide: "DATABASE_SERVICE",
            useFactory: databaseFactoryFake,
            inject: ["DATABASE_PROVIDER"],
        },
    ],
    exports: ["DATABASE_SERVICE"],
})
export class DatabaseModuleFake {}
