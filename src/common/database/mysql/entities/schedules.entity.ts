import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CarsEntity } from "./cars.entity";
import { CustomersEntity } from "./customers.entity";

@Entity("schedules")
export class SchedulesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => CustomersEntity, customer => customer.id)
    @JoinColumn({ name: "customer_id" })
    customer: CustomersEntity;

    @ManyToOne(() => CarsEntity, car => car.id)
    @JoinColumn({ name: "car_id" })
    car: CarsEntity;

    @Column({ type: "datetime" })
    date: Date;
}
