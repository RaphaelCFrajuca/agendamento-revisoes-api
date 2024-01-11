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

    async getSchedulesByDay(day: number, month: number): Promise<SchedulerDto[]> {
        return await this.databaseService.getSchedulesByDay(day, month);
    }

    async getAvaliableDaysToSchedule() {
        const actualDate = new Date();
        const currentHour = actualDate.getHours();

        if (currentHour >= 18) {
            actualDate.setDate(actualDate.getDate() + 1);
        }

        actualDate.setHours(currentHour < 8 ? 8 : currentHour);
        actualDate.setMinutes(currentHour < 30 ? 0 : 30);
        actualDate.setSeconds(0);
        actualDate.setMilliseconds(0);

        const days: Date[] = [];
        const daysInMonth = new Date(actualDate.getFullYear(), actualDate.getMonth() + 1, 0).getDate();

        for (let i = actualDate.getDate(); i <= daysInMonth; i++) {
            const day = new Date(actualDate.getFullYear(), actualDate.getMonth(), i, 8, 0, 0, 0);
            if (day.getDay() > 0 && day.getDay() < 6) {
                for (let j = 8; j < 18; j++) {
                    if (i === actualDate.getDate() && j <= currentHour) continue;
                    days.push(new Date(actualDate.getFullYear(), actualDate.getMonth(), i, j, 0, 0));
                    days.push(new Date(actualDate.getFullYear(), actualDate.getMonth(), i, j, 30, 0));
                }
            }
        }

        const schedules = await this.databaseService.getSchedulesByMonth(actualDate.getMonth() + 1);
        const avaliableDays = [];
        if (schedules) {
            for (const day of days) {
                day.setHours(day.getHours() - 3);
                let isAvaliable = true;
                for (const schedule of schedules) {
                    if (day.getTime() === schedule.dateTime.getTime()) {
                        isAvaliable = false;
                        break;
                    }
                }
                if (isAvaliable) {
                    day.setHours(day.getHours() + 3);
                    const dayString = day.toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    avaliableDays.push(dayString);
                }
            }
        }

        return avaliableDays;
    }
}
