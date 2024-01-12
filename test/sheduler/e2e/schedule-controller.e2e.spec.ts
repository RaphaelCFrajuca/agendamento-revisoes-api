import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ManagerGuard } from "src/common/guards/manager.guard";
import { ScheduleController } from "src/domain/scheduler/controllers/schedule.controller";
import { ScheduleService } from "src/domain/scheduler/services/schedule.service";
import * as request from "supertest";
import { DatabaseModuleFake } from "test/common/database/database-fake.module";
import { SqliteProviderFake } from "test/common/database/sqlite/sqlite-fake.provider";
import { EnvironmentModuleFake } from "test/common/environment/environment-fake.module";

describe("ScheduleController (e2e)", () => {
    let app: INestApplication;
    let databaseService: SqliteProviderFake;

    beforeEach(async () => {
        jest.useFakeTimers().setSystemTime(new Date("2021-08-10T10:00:00.000Z"));
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [EnvironmentModuleFake, DatabaseModuleFake],
            controllers: [ScheduleController],
            providers: [ScheduleService],
        })
            .overrideGuard(ManagerGuard)
            .useValue({ canActivate: () => true })
            .compile();

        app = moduleFixture.createNestApplication();
        app.enableCors();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: false },
                forbidNonWhitelisted: true,
            }),
        );
        await app.init();
        databaseService = moduleFixture.get<SqliteProviderFake>("DATABASE_SERVICE");
    });

    afterEach(async () => {
        jest.useRealTimers();
        await databaseService.destroy();
    });

    describe("/schedule (POST)", () => {
        const scheduleDtoValid = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: "10/08/2021 10:30",
            carModel: "Teste modelo",
            phone: "12345678900",
        };

        it("should create a schedule when valid schedule has provied", async () => {
            const response = await request(app.getHttpServer()).post("/schedule").set("Content-Type", "application/json").send(scheduleDtoValid);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                date: "2021-08-10T10:30:00.000Z",
                car: { licensePlate: "ABC1234", model: "Teste modelo", id: 1 },
                customer: { cpf: "12345678900", name: "Teste", phone: "12345678900", id: 1 },
                id: 1,
            });
        });

        it("should return 400 when invalid schedule has provied", async () => {
            const response = await request(app.getHttpServer()).post("/schedule").set("Content-Type", "application/json").send({ name: "Teste" });
            expect(response.status).toBe(400);
        });
    });

    describe("/schedule (GET)", () => {
        const scheduleDtoValid = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: "10/08/2021 10:30",
            carModel: "Teste modelo",
            phone: "12345678900",
        };

        it("should get all schedules", async () => {
            await databaseService.createSchedule({
                ...scheduleDtoValid,
                dateTime: new Date("2021-08-10T13:30:00.000Z"),
            });
            const response = await request(app.getHttpServer()).get("/schedule");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    ...scheduleDtoValid,
                    dateTime: "2021-08-10T10:30:00.000Z",
                },
            ]);
        });
    });

    describe("/schedule/:id (DELETE)", () => {
        const scheduleDtoValid = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: "10/08/2021 10:30",
            carModel: "Teste modelo",
            phone: "12345678900",
        };

        it("should delete a schedule when valid scheduleId as provied", async () => {
            const schedule = await databaseService.createSchedule({
                ...scheduleDtoValid,
                dateTime: new Date("2021-08-10T13:30:00.000Z"),
            });
            const response = await request(app.getHttpServer()).delete(`/schedule/${schedule.id}`);
            expect(response.status).toBe(204);
        });

        it("should return 400 when invalid scheduleId as provied", async () => {
            const response = await request(app.getHttpServer()).delete(`/schedule/invalid`);
            expect(response.status).toBe(400);
        });
    });

    describe("/schedule/:id (PUT)", () => {
        const scheduleDtoValid = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: "10/08/2021 10:30",
            carModel: "Teste modelo",
            phone: "12345678900",
        };

        it("should update a schedule when valid scheduleId as provied", async () => {
            const schedule = await databaseService.createSchedule({
                ...scheduleDtoValid,
                dateTime: new Date("2021-08-10T13:30:00.000Z"),
            });
            const response = await request(app.getHttpServer())
                .put(`/schedule/${schedule.id}`)
                .set("Content-Type", "application/json")
                .send({ ...scheduleDtoValid, dateTime: "10/08/2021 14:00" });
            const newSchedule = await databaseService.getSchedule(schedule.id);
            expect(newSchedule).toEqual({
                carLicensePlate: "ABC1234",
                carModel: "Teste modelo",
                cpf: "12345678900",
                name: "Teste",
                phone: "12345678900",
                dateTime: new Date("2021-08-10T14:00:00.000Z"),
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({});
        });

        it("should return 400 when invalid scheduleId as provied", async () => {
            const response = await request(app.getHttpServer()).put(`/schedule/invalid`).set("Content-Type", "application/json").send({ name: "Teste" });
            expect(response.status).toBe(400);
        });
    });

    describe("/schedule/:scheduleId (GET)", () => {
        const scheduleDtoValid = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: "10/08/2021 10:30",
            carModel: "Teste modelo",
            phone: "12345678900",
        };

        it("should get a schedule when valid scheduleId as provied", async () => {
            const schedule = await databaseService.createSchedule({
                ...scheduleDtoValid,
                dateTime: new Date("2021-08-10T13:30:00.000Z"),
            });
            const response = await request(app.getHttpServer()).get(`/schedule/${schedule.id}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                ...scheduleDtoValid,
                dateTime: "2021-08-10T10:30:00.000Z",
            });
        });

        it("should return 400 when invalid scheduleId as provied", async () => {
            const response = await request(app.getHttpServer()).get(`/schedule/invalid`);
            expect(response.status).toBe(400);
        });
    });

    describe("/schedule/car/:carLicensePlate (GET)", () => {
        const scheduleDtoValid = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: "10/08/2021 10:30",
            carModel: "Teste modelo",
            phone: "12345678900",
        };

        it("should get a schedule when valid carLicensePlate as provied", async () => {
            await databaseService.createSchedule({
                ...scheduleDtoValid,
                dateTime: new Date("2021-08-10T13:30:00.000Z"),
            });
            const response = await request(app.getHttpServer()).get(`/schedule/car/${scheduleDtoValid.carLicensePlate}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    ...scheduleDtoValid,
                    dateTime: "2021-08-10T10:30:00.000Z",
                },
            ]);
        });

        it("should return 400 when invalid carLicensePlate as provied", async () => {
            const response = await request(app.getHttpServer()).get(`/schedule/car/invalid`);
            expect(response.status).toBe(400);
        });
    });

    describe("/schedule/cpf/:cpf (GET)", () => {
        const scheduleDtoValid = {
            name: "Teste",
            cpf: "12345678900",
            carLicensePlate: "ABC1234",
            dateTime: "10/08/2021 10:30",
            carModel: "Teste modelo",
            phone: "12345678900",
        };

        it("should get a schedule when valid cpf as provied", async () => {
            await databaseService.createSchedule({
                ...scheduleDtoValid,
                dateTime: new Date("2021-08-10T13:30:00.000Z"),
            });
            const response = await request(app.getHttpServer()).get(`/schedule/cpf/${scheduleDtoValid.cpf}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    ...scheduleDtoValid,
                    dateTime: "2021-08-10T10:30:00.000Z",
                },
            ]);
        });

        it("should return 400 when invalid cpf as provied", async () => {
            const response = await request(app.getHttpServer()).get(`/schedule/cpf/invalid`);
            expect(response.status).toBe(400);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
