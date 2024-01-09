import { Module } from "@nestjs/common";
import { ScheduleController } from "src/domain/scheduler/controllers/schedule.controller";
import { ScheduleService } from "src/domain/scheduler/services/schedule.service";

@Module({
    imports: [],
    controllers: [ScheduleController],
    providers: [ScheduleService],
})
export class ScheduleModule {}
