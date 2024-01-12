import { DatabaseEnum } from "./enum/database.enum";
import { IDatabase } from "./interface/database.interface";
import { MysqlConfig } from "./mysql/interface/mysql-config.interface";
import { MysqlProvider } from "./mysql/mysql.provider";

export async function databaseFactory(databaseProvider: DatabaseEnum, mysqlConfig: MysqlConfig): Promise<IDatabase> {
    switch (databaseProvider) {
        case DatabaseEnum.MYSQL:
            return await new MysqlProvider(mysqlConfig).connect();
        case DatabaseEnum.MONGODB:
            return await new MysqlProvider(mysqlConfig).connect();
        default:
            return await new MysqlProvider(mysqlConfig).connect();
    }
}
