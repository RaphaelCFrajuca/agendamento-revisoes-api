import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SchedulerDto } from "src/domain/scheduler/dtos/scheduler.dto";
import { ScheduleService } from "src/domain/scheduler/services/schedule.service";

@ApiTags("schedule")
@Controller("schedule")
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Post()
    createScheduler(@Body() schedulerDto: SchedulerDto) {
        return this.scheduleService.createScheduler(schedulerDto);
    }
}
