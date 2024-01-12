import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ManagerGuard } from "src/common/guards/manager.guard";
import { SchedulerDto } from "../dtos/scheduler.dto";
import { ScheduleService } from "../services/schedule.service";

@ApiTags("schedule")
@Controller("schedule")
export class ScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService,
        @Inject("MANAGER_TOKEN") private readonly managerToken: string,
    ) {}

    @Post()
    @ApiOperation({ summary: "Criar um novo agendamento" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Agendamento criado com sucesso" })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "Agendamento já existe para esta data" })
    createScheduler(@Body() schedulerDto: SchedulerDto) {
        return this.scheduleService.createSchedule(schedulerDto);
    }

    @Get()
    @UseGuards(ManagerGuard)
    @ApiOperation({ summary: "Listar todos os agendamentos" })
    @ApiResponse({ status: HttpStatus.OK, description: "Agendamentos listados com sucesso" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Token inválido" })
    @ApiBearerAuth()
    async getAllSchedules() {
        return await this.scheduleService.getAllSchedules();
    }

    @Get("/avaliable-days")
    @ApiOperation({ summary: "Listar todos os dias disponíveis para agendamento no mês atual" })
    @ApiResponse({ status: HttpStatus.OK, description: "Dias listados com sucesso" })
    getAvaliableDaysToSchedule() {
        return this.scheduleService.getAvaliableDaysToSchedule();
    }

    @Delete(":id")
    @ApiOperation({ summary: "Deletar um agendamento" })
    @ApiBearerAuth()
    @UseGuards(ManagerGuard)
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Agendamento deletado com sucesso" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Agendamento não encontrado" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "ID do agendamento inválido" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Token inválido" })
    async deleteScheduler(@Param("id") id: number, @Res() res) {
        await this.scheduleService.deleteSchedule(id);
        res.status(HttpStatus.NO_CONTENT).send();
    }

    @Put(":id")
    @ApiOperation({ summary: "Atualizar um agendamento" })
    @ApiBearerAuth()
    @UseGuards(ManagerGuard)
    @ApiResponse({ status: HttpStatus.OK, description: "Agendamento atualizado com sucesso" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Agendamento não encontrado" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "ID do agendamento inválido" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Token inválido" })
    async updateScheduler(@Param("id") id: number, @Body() schedulerDto: SchedulerDto, @Res() res) {
        await this.scheduleService.updateSchedule(id, schedulerDto);
        res.status(HttpStatus.OK).send();
    }

    @Get(":scheduleId")
    @ApiBearerAuth()
    @UseGuards(ManagerGuard)
    @ApiResponse({ status: HttpStatus.OK, description: "Agendamento encontrado com sucesso", type: SchedulerDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Agendamento não encontrado" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Token inválido" })
    @ApiOperation({ summary: "Buscar um agendamento" })
    async getSchedule(@Param("scheduleId") scheduleId: number) {
        return await this.scheduleService.getSchedule(scheduleId);
    }

    @Get("/car/:carLicensePlate")
    @ApiBearerAuth()
    @UseGuards(ManagerGuard)
    @ApiResponse({ status: HttpStatus.OK, description: "Agendamentos encontrados com sucesso" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Agendamentos não encontrados" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Placa do veículo inválida" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Token inválido" })
    @ApiOperation({ summary: "Buscar agendamentos por placa do veículo" })
    async getSchedulesByLicensePlate(@Param("carLicensePlate") carLicensePlate: string) {
        return await this.scheduleService.getSchedulesByLicensePlate(carLicensePlate);
    }

    @Get("/cpf/:cpf")
    @ApiBearerAuth()
    @UseGuards(ManagerGuard)
    @ApiOperation({ summary: "Buscar agendamentos por CPF do cliente" })
    @ApiResponse({ status: HttpStatus.OK, description: "Agendamentos encontrados com sucesso" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Agendamentos não encontrados" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "CPF inválido" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Token inválido" })
    async getSchedulesByCpf(@Param("cpf") cpf: string) {
        return await this.scheduleService.getSchedulesByCpf(cpf);
    }

    @Get("/month/:month")
    @ApiBearerAuth()
    @UseGuards(ManagerGuard)
    @ApiOperation({ summary: "Buscar agendamentos por mês com base no ano atual" })
    @ApiResponse({ status: HttpStatus.OK, description: "Agendamentos encontrados com sucesso" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Agendamentos não encontrados" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Mês inválido" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Token inválido" })
    async getSchedulesByMonth(@Param("month") month: number) {
        return await this.scheduleService.getSchedulesByMonth(month);
    }

    @Get("/month/:month/week/:week")
    @ApiBearerAuth()
    @UseGuards(ManagerGuard)
    @ApiOperation({ summary: "Buscar agendamentos por semana com base no ano atual" })
    @ApiResponse({ status: HttpStatus.OK, description: "Agendamentos encontrados com sucesso" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Agendamentos não encontrados" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Semana inválida" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Mês inválido" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Token inválido" })
    async getSchedulesByWeek(@Param("week") week: number, @Param("month") month: number) {
        return await this.scheduleService.getSchedulesByWeek(week, month);
    }

    @Get("/month/:month/day/:day")
    @ApiBearerAuth()
    @UseGuards(ManagerGuard)
    @ApiOperation({ summary: "Buscar agendamentos por dia com base no ano atual" })
    @ApiResponse({ status: HttpStatus.OK, description: "Agendamentos encontrados com sucesso" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Agendamentos não encontrados" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Dia inválido" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Mês inválido" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Token inválido" })
    async getSchedulesByDay(@Param("day") day: number, @Param("month") month: number) {
        return await this.scheduleService.getSchedulesByDay(day, month);
    }
}
