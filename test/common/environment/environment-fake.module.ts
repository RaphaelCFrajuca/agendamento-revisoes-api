import { Module } from "@nestjs/common";

@Module({
    imports: [],
    providers: [
        {
            provide: "DATABASE_PROVIDER",
            useValue: "MYSQL",
        },
    ],
    exports: ["DATABASE_PROVIDER"],
})
export class EnvironmentModuleFake {}
