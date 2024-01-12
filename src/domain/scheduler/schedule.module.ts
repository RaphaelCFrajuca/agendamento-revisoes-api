import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/common/database/database.module";
import { EnvironmentModule } from "src/common/environment/environment.module";
import { ScheduleController } from "src/domain/scheduler/controllers/schedule.controller";
import { ScheduleService } from "src/domain/scheduler/services/schedule.service";

@Module({
    imports: [DatabaseModule, EnvironmentModule],
    controllers: [ScheduleController],
    providers: [ScheduleService],
})
export class ScheduleModule {}
