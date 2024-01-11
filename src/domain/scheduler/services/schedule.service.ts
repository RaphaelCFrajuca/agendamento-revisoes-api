import { Inject } from "@nestjs/common";
import { IDatabase } from "src/common/database/interface/database.interface";
import { SchedulerDto } from "../dtos/scheduler.dto";

export class ScheduleService {
    constructor(@Inject("DATABASE_SERVICE") private readonly databaseService: IDatabase) {}

    async createSchedule(createSchedulerDto: SchedulerDto): Promise<SchedulerDto> {
        return await this.databaseService.createSchedule(createSchedulerDto);
    }

    async getAllSchedules(): Promise<SchedulerDto[]> {
        return await this.databaseService.getAllSchedules();
    }

    async deleteSchedule(scheduleId: number): Promise<void> {
        return await this.databaseService.deleteSchedule(scheduleId);
    }

    async updateSchedule(scheduleId: number, schedulerDto: SchedulerDto): Promise<void> {
        return await this.databaseService.updateSchedule(scheduleId, schedulerDto);
    }

    async getSchedule(scheduleId: number): Promise<SchedulerDto> {
        return await this.databaseService.getSchedule(scheduleId);
    }

    async getSchedulesByLicensePlate(carLicensePlate: string): Promise<SchedulerDto[]> {
        return await this.databaseService.getSchedulesByLicensePlate(carLicensePlate);
    }

    async getSchedulesByCpf(cpf: string): Promise<SchedulerDto[]> {
        return await this.databaseService.getSchedulesByCpf(cpf);
    }
}
