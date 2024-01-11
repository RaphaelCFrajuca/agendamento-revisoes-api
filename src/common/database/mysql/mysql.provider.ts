import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { isValidScheduleDate } from "src/common/utils/validators.utils";
import { SchedulerDto } from "src/domain/scheduler/dtos/scheduler.dto";
import { DataSource, EntityNotFoundError } from "typeorm";
import { IDatabase } from "../interface/database.interface";
import { CarsEntity } from "./entities/cars.entity";
import { CustomersEntity } from "./entities/customers.entity";
import { SchedulesEntity } from "./entities/schedules.entity";
import { MysqlConfig } from "./interface/mysql-config.interface";

export class MysqlProvider implements IDatabase {
    constructor(private readonly mysqlConfig: MysqlConfig) {
        (async () => {
            await this.connect();
        })();
    }

    protected static dataSource: DataSource;

    async createSchedule(schedulerDto: SchedulerDto): Promise<SchedulesEntity> {
        let car = await MysqlProvider.dataSource.getRepository(CarsEntity).findOne({ where: { licensePlate: schedulerDto.carLicensePlate } });
        let customer = await MysqlProvider.dataSource.getRepository(CustomersEntity).findOne({ where: { cpf: schedulerDto.cpf } });

        if (await MysqlProvider.dataSource.getRepository(SchedulesEntity).findOne({ where: { date: schedulerDto.dateTime } })) {
            throw new ConflictException("Schedule already exists for this date");
        }

        if (!car) {
            car = new CarsEntity();
            car.licensePlate = schedulerDto.carLicensePlate;
            car.model = schedulerDto.carModel;
            await MysqlProvider.dataSource.manager.save(car);
        }

        if (!customer) {
            customer = new CustomersEntity();
            customer.cpf = schedulerDto.cpf;
            customer.name = schedulerDto.name;
            customer.phone = schedulerDto.phone;
            await MysqlProvider.dataSource.manager.save(customer);
        }

        const schedule = new SchedulesEntity();
        schedule.date = schedulerDto.dateTime;

        try {
            if (!isValidScheduleDate(schedule.date)) {
                throw new BadRequestException("Invalid date");
            }
        } catch (error) {
            throw error;
        }

        schedule.car = car;
        schedule.customer = customer;
        const scheduleSaved = await MysqlProvider.dataSource.manager.save(schedule);
        scheduleSaved.date.setHours(scheduleSaved.date.getHours() - 3);
        return scheduleSaved;
    }

    async getSchedule(scheduleId: number): Promise<SchedulerDto> {
        const schedule = await MysqlProvider.dataSource.getRepository(SchedulesEntity).findOne({ where: { id: scheduleId }, relations: ["car", "customer"] });

        if (isNaN(scheduleId) || scheduleId < 1) {
            throw new BadRequestException("Invalid schedule id");
        }

        if (!schedule) {
            throw new NotFoundException("Schedule not found");
        }

        schedule.date.setHours(schedule.date.getHours() - 3);

        const scheduleDto: SchedulerDto = {
            carLicensePlate: schedule.car.licensePlate,
            carModel: schedule.car.model,
            cpf: schedule.customer.cpf,
            name: schedule.customer.name,
            phone: schedule.customer.phone,
            dateTime: schedule.date,
        };

        return scheduleDto;
    }

    async getAllSchedules(): Promise<SchedulerDto[]> {
        const schedules = await MysqlProvider.dataSource.getRepository(SchedulesEntity).find();
        return Promise.all(
            schedules.map(async schedule => {
                const scheduleDto: SchedulerDto = await this.getSchedule(schedule.id);
                return scheduleDto;
            }),
        );
    }

    async getSchedulesByLicensePlate(carLicensePlate: string): Promise<SchedulerDto[]> {
        try {
            const schedules = (
                await MysqlProvider.dataSource.getRepository(CarsEntity).findOneOrFail({
                    where: { licensePlate: carLicensePlate },
                    relations: {
                        schedules: true,
                    },
                })
            ).schedules;

            return Promise.all(
                schedules.map(async schedule => {
                    const scheduleDto: SchedulerDto = await this.getSchedule(schedule.id);
                    return scheduleDto;
                }),
            );
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new BadRequestException("Invalid license plate");
            } else {
                throw error;
            }
        }
    }

    async getSchedulesByCpf(cpf: string): Promise<SchedulerDto[]> {
        try {
            const schedules = (
                await MysqlProvider.dataSource.getRepository(CustomersEntity).findOneOrFail({
                    where: { cpf: cpf },
                    relations: {
                        schedules: true,
                    },
                })
            ).schedules;

            return Promise.all(
                schedules.map(async schedule => {
                    const scheduleDto: SchedulerDto = await this.getSchedule(schedule.id);
                    return scheduleDto;
                }),
            );
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new BadRequestException("Invalid CPF");
            } else {
                throw error;
            }
        }
    }

    async getSchedulesByMonth(month: number): Promise<SchedulerDto[]> {
        if (month < 1 || month > 12 || isNaN(month)) {
            throw new BadRequestException("Invalid month");
        }

        const actualYear = new Date().getFullYear();
        const schedules = await MysqlProvider.dataSource
            .getRepository(SchedulesEntity)
            .createQueryBuilder("schedule")
            .where("MONTH(schedule.date) = :month AND YEAR(schedule.date) = :year", { year: actualYear, month: month })
            .getMany();

        return Promise.all(
            schedules.map(async schedule => {
                const scheduleDto: SchedulerDto = await this.getSchedule(schedule.id);
                return scheduleDto;
            }),
        );
    }

    async getSchedulesByWeek(week: number, month: number): Promise<SchedulerDto[]> {
        if (week < 1 || week > 5 || isNaN(week)) {
            throw new BadRequestException("Invalid week");
        }

        if (month < 1 || month > 12 || isNaN(month)) {
            throw new BadRequestException("Invalid month");
        }

        const actualYear = new Date().getFullYear();
        const schedules = await MysqlProvider.dataSource
            .getRepository(SchedulesEntity)
            .createQueryBuilder("schedule")
            .where("YEAR(schedule.date) = :year", { year: actualYear })
            .andWhere("MONTH(schedule.date) = :month", { month: month })
            .andWhere(
                "WEEK(schedule.date, 3) = (SELECT MIN(WEEK(schedules.date, 3)) + :week FROM schedules WHERE YEAR(schedules.date) = :year AND MONTH(schedules.date) = :month)",
                {
                    year: actualYear,
                    month: month,
                    week: week - 1,
                },
            )
            // AND WEEK(`schedule`.`date`, 3) = (SELECT MIN(WEEK(`date`, 3)) + 2 FROM `schedules` WHERE YEAR(`date`) = @target_year AND MONTH(`date`) = @target_month);
            .getMany();

        return Promise.all(
            schedules.map(async schedule => {
                const scheduleDto: SchedulerDto = await this.getSchedule(schedule.id);
                return scheduleDto;
            }),
        );
    }

    async deleteSchedule(scheduleId: number) {
        if (isNaN(scheduleId) || scheduleId < 1) {
            throw new BadRequestException("Invalid schedule id");
        }

        const deleteRow = await MysqlProvider.dataSource.manager.delete(SchedulesEntity, scheduleId);
        if (!deleteRow.affected) {
            throw new NotFoundException("Schedule not found");
        }
    }

    async updateSchedule(scheduleId: number, schedule: SchedulerDto) {
        if (isNaN(scheduleId) || scheduleId < 1) {
            throw new BadRequestException("Invalid schedule id");
        }

        const car = await MysqlProvider.dataSource.getRepository(CarsEntity).findOne({ where: { licensePlate: schedule.carLicensePlate } });
        if (!car) {
            throw new NotFoundException("Car not found");
        }

        const customer = await MysqlProvider.dataSource.getRepository(CustomersEntity).findOne({ where: { cpf: schedule.cpf } });
        if (!customer) {
            throw new NotFoundException("Customer not found");
        }

        const newSchedule = new SchedulesEntity();
        newSchedule.date = schedule.dateTime;
        newSchedule.car = car;
        newSchedule.customer = customer;

        const updateRow = await MysqlProvider.dataSource.manager.update(SchedulesEntity, scheduleId, newSchedule);
        if (!updateRow.affected) {
            throw new NotFoundException("Schedule not found");
        }
    }

    private async connect() {
        if (!MysqlProvider.dataSource) {
            MysqlProvider.dataSource = new DataSource({
                type: "mysql",
                host: this.mysqlConfig.host,
                port: this.mysqlConfig.port,
                username: this.mysqlConfig.username,
                password: this.mysqlConfig.password,
                database: this.mysqlConfig.database,
                entities: [CarsEntity, CustomersEntity, SchedulesEntity],
                synchronize: false,
                logging: false,
            });
        }

        return MysqlProvider.dataSource.isInitialized ? MysqlProvider.dataSource : MysqlProvider.dataSource.initialize();
    }

    async destroy(): Promise<void> {
        const mysqlManager = await this.connect();
        await mysqlManager.destroy();
    }
}
