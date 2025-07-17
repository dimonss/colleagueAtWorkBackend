import {initDatabase} from "../src/config/databaseInit";
import {DatabaseConfig} from "../src/config/database";

const db = DatabaseConfig.getInstance().getDatabase();
initDatabase(db);
