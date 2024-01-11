import { ConflictException, NotFoundException } from "@nestjs/common";
import { SchedulerDto } from "src/domain/scheduler/dtos/scheduler.dto";
import { DataSource } from "typeorm";
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
        schedule.car = car;
        schedule.customer = customer;
        return MysqlProvider.dataSource.manager.save(schedule);
    }

    async getSchedule(scheduleId: number): Promise<SchedulerDto> {
        const schedule = await MysqlProvider.dataSource.getRepository(SchedulesEntity).findOne({ where: { id: scheduleId }, relations: ["car", "customer"] });

        if (!schedule) {
            throw new NotFoundException("Schedule not found");
        }

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
        const schedules = (
            await MysqlProvider.dataSource.getRepository(CarsEntity).findOne({
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
    }

    async getSchedulesByCpf(cpf: string): Promise<SchedulerDto[]> {
        const schedules = (
            await MysqlProvider.dataSource.getRepository(CustomersEntity).findOne({
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
    }

    async deleteSchedule(scheduleId: number) {
        const deleteRow = await MysqlProvider.dataSource.manager.delete(SchedulesEntity, scheduleId);
        if (!deleteRow.affected) {
            throw new NotFoundException("Schedule not found");
        }
    }

    async updateSchedule(scheduleId: number, schedule: SchedulerDto) {
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