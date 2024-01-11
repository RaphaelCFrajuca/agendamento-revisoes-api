import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { SchedulesEntity } from "./schedules.entity";

@Entity("cars")
export class CarsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "model", type: "varchar", length: 100 })
    model: string;

    @Column({ name: "license-plate", type: "varchar", length: 7 })
    @Unique(["licensePlate"])
    licensePlate: string;

    @OneToMany(() => SchedulesEntity, schedule => schedule.car)
    schedules: SchedulesEntity[];
}
