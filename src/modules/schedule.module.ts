import { Module } from "@nestjs/common";
import { ScheduleController } from "src/controllers/schedule.controller";
import { ScheduleService } from "src/domain/services/schedule.service";

@Module({
    imports: [],
    controllers: [ScheduleController],
    providers: [ScheduleService],
})
export class ScheduleModule {}
