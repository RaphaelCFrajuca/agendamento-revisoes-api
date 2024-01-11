import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SchedulerDto } from "../dtos/scheduler.dto";
import { ScheduleService } from "../services/schedule.service";

@ApiTags("schedule")
@Controller("schedule")
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Post()
    createScheduler(@Body() schedulerDto: SchedulerDto) {
        return this.scheduleService.createSchedule(schedulerDto);
    }

    @Get()
    async getAllSchedules() {
        return await this.scheduleService.getAllSchedules();
    }

    @Delete(":id")
    async deleteScheduler(@Param("id") id: number, @Res() res) {
        await this.scheduleService.deleteSchedule(id);
        res.status(HttpStatus.NO_CONTENT).send();
    }

    @Put(":id")
    async updateScheduler(@Param("id") id: number, @Body() schedulerDto: SchedulerDto, @Res() res) {
        await this.scheduleService.updateSchedule(id, schedulerDto);
        res.status(HttpStatus.OK).send();
    }

    @Get(":scheduleId")
    async getSchedule(@Param("scheduleId") scheduleId: number) {
        return await this.scheduleService.getSchedule(scheduleId);
    }

    @Get("/car/:carLicensePlate")
    async getSchedulesByLicensePlate(@Param("carLicensePlate") carLicensePlate: string) {
        return await this.scheduleService.getSchedulesByLicensePlate(carLicensePlate);
    }

    @Get("/cpf/:cpf")
    async getSchedulesByCpf(@Param("cpf") cpf: string) {
        return await this.scheduleService.getSchedulesByCpf(cpf);
    }
}
