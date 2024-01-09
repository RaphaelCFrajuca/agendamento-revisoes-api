import { SchedulerDto } from "../dtos/scheduler.dto";

export class ScheduleService {
    async createScheduler(createSchedulerDto: SchedulerDto): Promise<SchedulerDto> {
        return createSchedulerDto;
    }
}
