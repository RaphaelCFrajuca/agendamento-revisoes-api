import { Test, TestingModule } from "@nestjs/testing";
import { IDatabase } from "src/common/database/interface/database.interface";
import { SchedulerDto } from "src/domain/scheduler/dtos/scheduler.dto";
import { ScheduleService } from "src/domain/scheduler/services/schedule.service";

describe("ScheduleService (unit)", () => {
    let service: ScheduleService;
    let mockDatabaseService: IDatabase;

    const scheduleDtoValid: SchedulerDto = {
        name: "Teste",
        cpf: "12345678900",
        carLicensePlate: "ABC1234",
        dateTime: new Date("2021-08-10T10:30:00.000Z"),
        carModel: "Teste modelo",
        phone: "12345678900",
    };

    beforeEach(async () => {
        mockDatabaseService = {
            createSchedule: jest.fn(),
            getAllSchedules: jest.fn(),
            deleteSchedule: jest.fn(),
            updateSchedule: jest.fn(),
            getSchedule: jest.fn(),
            getSchedulesByLicensePlate: jest.fn(),
            getSchedulesByCpf: jest.fn(),
            getSchedulesByDay: jest.fn(),
            getSchedulesByWeek: jest.fn(),
            getSchedulesByMonth: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [ScheduleService, { provide: "DATABASE_SERVICE", useValue: mockDatabaseService }],
        }).compile();

        service = module.get<ScheduleService>(ScheduleService);
        mockDatabaseService = module.get<IDatabase>("DATABASE_SERVICE");
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("createSchedule", () => {
        it("should create a schedule when valid schedule as provied", async () => {
            jest.spyOn(mockDatabaseService, "createSchedule").mockImplementation(async () => scheduleDtoValid);

            const result = await service.createSchedule(scheduleDtoValid);
            expect(result).toEqual(scheduleDtoValid);
            expect(mockDatabaseService.createSchedule).toHaveBeenCalledWith(scheduleDtoValid);
        });
    });

    describe("getAllSchedules", () => {
        it("should return all schedules", async () => {
            jest.spyOn(mockDatabaseService, "getAllSchedules").mockImplementation(async () => [scheduleDtoValid]);

            const result = await service.getAllSchedules();
            expect(result).toEqual([scheduleDtoValid]);
            expect(mockDatabaseService.getAllSchedules).toHaveBeenCalled();
        });
    });

    describe("deleteSchedule", () => {
        it("should delete a schedule when valid scheduleId as provied", async () => {
            jest.spyOn(mockDatabaseService, "deleteSchedule").mockImplementation(async () => {});

            await service.deleteSchedule(1);
            expect(mockDatabaseService.deleteSchedule).toHaveBeenCalledWith(1);
        });
    });

    describe("updateSchedule", () => {
        it("should update a schedule when valid scheduleId as provied", async () => {
            jest.spyOn(mockDatabaseService, "updateSchedule").mockImplementation(async () => {});

            await service.updateSchedule(1, scheduleDtoValid);
            expect(mockDatabaseService.updateSchedule).toHaveBeenCalledWith(1, scheduleDtoValid);
        });
    });

    describe("getSchedule", () => {
        it("should return a schedule when valid scheduleId as provied", async () => {
            jest.spyOn(mockDatabaseService, "getSchedule").mockImplementation(async () => scheduleDtoValid);

            const result = await service.getSchedule(1);
            expect(result).toEqual(scheduleDtoValid);
            expect(mockDatabaseService.getSchedule).toHaveBeenCalledWith(1);
        });
    });

    describe("getSchedulesByLicensePlate", () => {
        it("should return a schedule when valid licensePlate as provied", async () => {
            jest.spyOn(mockDatabaseService, "getSchedulesByLicensePlate").mockImplementation(async () => [scheduleDtoValid]);

            const result = await service.getSchedulesByLicensePlate("ABC1234");
            expect(result).toEqual([scheduleDtoValid]);
            expect(mockDatabaseService.getSchedulesByLicensePlate).toHaveBeenCalledWith("ABC1234");
        });
    });

    describe("getSchedulesByCpf", () => {
        it("should return a schedule when valid cpf as provied", async () => {
            jest.spyOn(mockDatabaseService, "getSchedulesByCpf").mockImplementation(async () => [scheduleDtoValid]);

            const result = await service.getSchedulesByCpf("12345678900");
            expect(result).toEqual([scheduleDtoValid]);
            expect(mockDatabaseService.getSchedulesByCpf).toHaveBeenCalledWith("12345678900");
        });
    });

    describe("getSchedulesByDay", () => {
        it("should return a schedule when valid day and month as provied", async () => {
            jest.spyOn(mockDatabaseService, "getSchedulesByDay").mockImplementation(async () => [scheduleDtoValid]);

            const result = await service.getSchedulesByDay(1, 1);
            expect(result).toEqual([scheduleDtoValid]);
            expect(mockDatabaseService.getSchedulesByDay).toHaveBeenCalledWith(1, 1);
        });
    });

    describe("getSchedulesByWeek", () => {
        it("should return a schedule when valid week and month as provied", async () => {
            jest.spyOn(mockDatabaseService, "getSchedulesByWeek").mockImplementation(async () => [scheduleDtoValid]);

            const result = await service.getSchedulesByWeek(1, 1);
            expect(result).toEqual([scheduleDtoValid]);
            expect(mockDatabaseService.getSchedulesByWeek).toHaveBeenCalledWith(1, 1);
        });
    });

    describe("getSchedulesByMonth", () => {
        it("should return a schedule when valid month as provied", async () => {
            jest.spyOn(mockDatabaseService, "getSchedulesByMonth").mockImplementation(async () => [scheduleDtoValid]);

            const result = await service.getSchedulesByMonth(1);
            expect(result).toEqual([scheduleDtoValid]);
            expect(mockDatabaseService.getSchedulesByMonth).toHaveBeenCalledWith(1);
        });
    });

    describe("getAvaliableDaysToSchedule", () => {
        it("should return a schedule when valid month as provied", async () => {
            jest.spyOn(mockDatabaseService, "getSchedulesByMonth").mockImplementation(async () => [scheduleDtoValid]);

            const result = await service.getSchedulesByMonth(1);
            expect(result).toEqual([scheduleDtoValid]);
            expect(mockDatabaseService.getSchedulesByMonth).toHaveBeenCalledWith(1);
        });

        it("should return a list of avaliable days to schedule", async () => {
            jest.useFakeTimers().setSystemTime(new Date("2021-08-10T10:00:00.000Z").getTime());

            jest.spyOn(mockDatabaseService, "getSchedulesByMonth").mockImplementation(async () => [scheduleDtoValid]);

            const result = await service.getAvaliableDaysToSchedule();
            expect(result).not.toContain("10/08/2021, 10:30");
            expect(mockDatabaseService.getSchedulesByMonth).toHaveBeenCalledWith(8);
        });
    });
});
