import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { SchedulesEntity } from "./schedules.entity";

@Entity("customers")
export class CustomersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", type: "varchar", length: 100 })
    name: string;

    @Column({ name: "phone", type: "varchar", length: 20 })
    phone: string;

    @Column({ name: "cpf", type: "varchar", length: 11 })
    @Unique(["cpf"])
    cpf: string;

    @OneToMany(() => SchedulesEntity, schedule => schedule.customer)
    schedules: SchedulesEntity[];
}
