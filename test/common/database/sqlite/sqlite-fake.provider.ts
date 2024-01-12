import { CarsEntity } from "src/common/database/mysql/entities/cars.entity";
import { CustomersEntity } from "src/common/database/mysql/entities/customers.entity";
import { SchedulesEntity } from "src/common/database/mysql/entities/schedules.entity";
import { MysqlConfig } from "src/common/database/mysql/interface/mysql-config.interface";
import { MysqlProvider } from "src/common/database/mysql/mysql.provider";
import { DataSource } from "typeorm";

export class SqliteProviderFake extends MysqlProvider {
    constructor(config: MysqlConfig) {
        super(config);
    }

    connect = async () => {
        if (!MysqlProvider.dataSource) {
            MysqlProvider.dataSource = new DataSource({
                type: "sqlite",
                database: ":memory:",
                entities: [CarsEntity, CustomersEntity, SchedulesEntity],
                synchronize: true,
                dropSchema: true,
                logging: false,
            });
        }

        MysqlProvider.dataSource.isInitialized ? MysqlProvider.dataSource : await MysqlProvider.dataSource.initialize();

        return this;
    };

    async destroy() {
        await MysqlProvider.dataSource.destroy();
    }
}
