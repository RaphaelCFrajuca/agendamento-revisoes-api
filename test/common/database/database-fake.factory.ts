import { DatabaseEnum } from "src/common/database/enum/database.enum";
import { IDatabase } from "src/common/database/interface/database.interface";
import { SqliteProviderFake } from "./sqlite/sqlite-fake.provider";

const fakeConfig = {
    host: null,
    port: null,
    username: null,
    password: null,
    database: null,
};

export async function databaseFactoryFake(databaseProvider: DatabaseEnum): Promise<IDatabase> {
    switch (databaseProvider) {
        case DatabaseEnum.MYSQL:
            return await new SqliteProviderFake(fakeConfig).connect();
        case DatabaseEnum.MONGODB:
            return await new SqliteProviderFake(fakeConfig).connect();
        default:
            return await new SqliteProviderFake(fakeConfig).connect();
    }
}
