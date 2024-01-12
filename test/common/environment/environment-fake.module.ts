import { Module } from "@nestjs/common";

@Module({
    imports: [],
    providers: [
        {
            provide: "DATABASE_PROVIDER",
            useValue: "MYSQL",
        },
        {
            provide: "MANAGER_TOKEN",
            useValue: "teste",
        },
    ],
    exports: ["DATABASE_PROVIDER", "MANAGER_TOKEN"],
})
export class EnvironmentModuleFake {}
