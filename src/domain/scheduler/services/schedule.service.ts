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

    async getSchedulesByMonth(month: number): Promise<SchedulerDto[]> {
        return await this.databaseService.getSchedulesByMonth(month);
    }

    async getSchedulesByWeek(week: number, month: number): Promise<SchedulerDto[]> {
        return await this.databaseService.getSchedulesByWeek(week, month);
    }

    getAvaliableDaysToSchedule() {
        const actualDate = new Date();

        // gerar array com os dias úteis do mês atual (segunda a sexta) apenas nos horários das 8h às 18h com intervalos de 30 em 30 minutos
        const days = [];
        const daysInMonth = new Date(actualDate.getFullYear(), actualDate.getMonth() + 1, 0).getDate();
        // gerar apenas os dias a partir do dia atual
        for (let i = actualDate.getDate(); i <= daysInMonth; i++) {
            const day = new Date(actualDate.getFullYear(), actualDate.getMonth(), i, 8, 0, 0, 0);
            if (day.getDay() > 0 && day.getDay() < 6) {
                for (let j = 8; j < 18; j++) {
                    days.push(new Date(actualDate.getFullYear(), actualDate.getMonth(), i, j, 0, 0));
                    days.push(new Date(actualDate.getFullYear(), actualDate.getMonth(), i, j, 30, 0));
                }
            }
        }

        // for (let i = 0; i < 30; i++) {
        //     const day = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + i, 8, 0, 0, 0);
        //     if (day.getDay() > 0 && day.getDay() < 6) {
        //         days.push(day);
        //     }
        // }

        return days;
    }
}
