import { Module } from "@nestjs/common";
import { ScheduleModule } from "./domain/scheduler/schedule.module";

@Module({
    imports: [ScheduleModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
