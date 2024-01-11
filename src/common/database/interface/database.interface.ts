import { SchedulerDto } from "src/domain/scheduler/dtos/scheduler.dto";

export interface IDatabase {
    createSchedule(schedule: SchedulerDto);
    getSchedule(scheduleId: number);
    getAllSchedules();
    getSchedulesByLicensePlate(carLicensePlate: string);
    getSchedulesByCpf(cpf: string);
    deleteSchedule(scheduleId: number);
    updateSchedule(scheduleId: number, schedule: SchedulerDto);
}
