import { CreateSchedulerDto } from "../dto/create-scheduler.dto";

export class ScheduleService {
    async createScheduler(createSchedulerDto: CreateSchedulerDto) {
        return createSchedulerDto;
    }
}
