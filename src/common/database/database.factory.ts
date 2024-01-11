import { DatabaseEnum } from "./enum/database.enum";
import { IDatabase } from "./interface/database.interface";
import { MysqlConfig } from "./mysql/interface/mysql-config.interface";
import { MysqlProvider } from "./mysql/mysql.provider";

export function databaseFactory(databaseProvider: DatabaseEnum, mysqlConfig: MysqlConfig): IDatabase {
    switch (databaseProvider) {
        case DatabaseEnum.MYSQL:
            return new MysqlProvider(mysqlConfig);
        case DatabaseEnum.MONGODB:
            return new MysqlProvider(mysqlConfig);
        default:
            return new MysqlProvider(mysqlConfig);
    }
}
