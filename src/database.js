import { createPool } from "mysql2";

const pool = createPool({
    host: 'proyecto.czm4kg8uatb5.us-east-2.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'AstraGC2024',
    database: 'Diocesis'
});