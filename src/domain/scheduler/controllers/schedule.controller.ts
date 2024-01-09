import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateSchedulerDto } from "src/domain/scheduler/dtos/scheduler.dto";
import { ScheduleService } from "src/domain/scheduler/services/schedule.service";

@ApiTags("schedule")
@Controller("schedule")
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Post()
    createScheduler(@Body() createSchedulerDto: CreateSchedulerDto) {
        return this.scheduleService.createScheduler(createSchedulerDto);
    }
}
