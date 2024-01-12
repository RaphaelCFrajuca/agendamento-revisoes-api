import { Test, TestingModule } from "@nestjs/testing";
import { SchedulerDto } from "src/domain/scheduler/dtos/scheduler.dto";
import { ScheduleService } from "src/domain/scheduler/services/schedule.service";
import { DatabaseModuleFake } from "test/common/database/database-fake.module";
import { SqliteProviderFake } from "test/common/database/sqlite/sqlite-fake.provider";

describe("ScheduleService (integration)", () => {
    let service: ScheduleService;
    let databaseService: SqliteProviderFake;

    beforeEach(async () => {
        jest.useFakeTimers().setSystemTime(new Date("2021-08-10T10:00:00.000Z"));
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModuleFake],
            providers: [ScheduleService],
        }).compile();

        service = module.get<ScheduleService>(ScheduleService);
        databaseService = module.get<SqliteProviderFake>("DATABASE_SERVICE");
    });

    afterEach(async () => {
        jest.useRealTimers();
        await databaseService.destroy();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("createSchedule", () => {
        const scheduleDtoValid: SchedulerDto = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: new Date("2021-08-10T12:30:00.000Z"),
            carModel: "Teste modelo",
            phone: "12345678900",
        };
        it("should create a schedule when valid schedule has provied", async () => {
            jest.useFakeTimers().setSystemTime(new Date("2021-08-10T10:00:00.000Z"));
            await service.createSchedule(scheduleDtoValid);
            const expected = await databaseService.getSchedule(1);
            expect(expected).toEqual(scheduleDtoValid);
        });
    });

    describe("getAllSchedules", () => {
        const scheduleDtoValid: SchedulerDto = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: new Date("2021-08-10T12:30:00.000Z"),
            carModel: "Teste modelo",
            phone: "12345678900",
        };
        it("should return all schedules", async () => {
            await databaseService.createSchedule(scheduleDtoValid);
            const result = await service.getAllSchedules();
            expect(result).toEqual([scheduleDtoValid]);
        });
    });

    describe("deleteSchedule", () => {
        const scheduleDtoValid: SchedulerDto = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: new Date("2021-08-10T12:30:00.000Z"),
            carModel: "Teste modelo",
            phone: "12345678900",
        };
        it("should delete a schedule", async () => {
            const schedule = await databaseService.createSchedule(scheduleDtoValid);
            await service.deleteSchedule(schedule.id);
            const result = await service.getAllSchedules();
            expect(result).toEqual([]);
        });
    });

    describe("updateSchedule", () => {
        const scheduleDtoValid: SchedulerDto = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: new Date("2021-08-10T12:30:00.000Z"),
            carModel: "Teste modelo",
            phone: "12345678900",
        };
        it("should update a schedule", async () => {
            const schedule = await databaseService.createSchedule(scheduleDtoValid);
            const scheduleUpdated = { ...scheduleDtoValid, name: "Teste 2", dateTime: new Date("2021-08-10T13:30:00.000Z") };
            await service.updateSchedule(schedule.id, scheduleUpdated);
            const result = await service.getSchedule(schedule.id);
            expect(result).toEqual({
                ...scheduleUpdated,
                dateTime: new Date("2021-08-10T10:30:00.000Z"),
            });
        });
    });

    describe("getSchedule", () => {
        const scheduleDtoValid: SchedulerDto = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: new Date("2021-08-10T12:30:00.000Z"),
            carModel: "Teste modelo",
            phone: "12345678900",
        };
        it("should get a schedule", async () => {
            const schedule = await databaseService.createSchedule(scheduleDtoValid);
            const result = await service.getSchedule(schedule.id);
            expect(result).toEqual(scheduleDtoValid);
        });
    });

    describe("getSchedulesByLicensePlate", () => {
        const scheduleDtoValid: SchedulerDto = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: new Date("2021-08-10T12:30:00.000Z"),
            carModel: "Teste modelo",
            phone: "12345678900",
        };
        it("should get schedules by license plate", async () => {
            await databaseService.createSchedule(scheduleDtoValid);
            const result = await service.getSchedulesByLicensePlate("ABC1234");
            expect(result).toEqual([scheduleDtoValid]);
        });
    });

    describe("getSchedulesByCpf", () => {
        const scheduleDtoValid: SchedulerDto = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: new Date("2021-08-10T12:30:00.000Z"),
            carModel: "Teste modelo",
            phone: "12345678900",
        };
        it("should get schedules by cpf", async () => {
            await databaseService.createSchedule(scheduleDtoValid);
            const result = await service.getSchedulesByCpf("12345678900");
            expect(result).toEqual([scheduleDtoValid]);
        });
    });

    describe("getSchedulesByMonth", () => {
        const scheduleDtoValid: SchedulerDto = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: new Date("2021-08-10T12:30:00.000Z"),
            carModel: "Teste modelo",
            phone: "12345678900",
        };
        // SQLITE não suporta querys com a função MONTH
        it.skip("should get schedules by month", async () => {
            await databaseService.createSchedule(scheduleDtoValid);
            const result = await service.getSchedulesByMonth(8);
            expect(result).toEqual([scheduleDtoValid]);
        });
    });

    describe("getSchedulesByWeek", () => {
        const scheduleDtoValid: SchedulerDto = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: new Date("2021-08-10T12:30:00.000Z"),
            carModel: "Teste modelo",
            phone: "12345678900",
        };

        // SQLITE não suporta querys com a função WEEK e MONTH
        it.skip("should get schedules by week", async () => {
            await databaseService.createSchedule(scheduleDtoValid);
            const result = await service.getSchedulesByWeek(2, 8);
            expect(result).toEqual([scheduleDtoValid]);
        });
    });

    describe("getSchedulesByDay", () => {
        const scheduleDtoValid: SchedulerDto = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: new Date("2021-09-10T12:30:00.000Z"),
            carModel: "Teste modelo",
            phone: "12345678900",
        };

        // SQLITE não suporta querys com a função DAY, MONTH e WEEK
        it.skip("should get schedules by day", async () => {
            await databaseService.createSchedule(scheduleDtoValid);
            const result = await service.getSchedulesByDay(10, 9);
            expect(result).toEqual([scheduleDtoValid]);
        });
    });
});
