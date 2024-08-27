import * as pg from "pg";
const { Pool } = pg.default;
import "dotenv/config";
const connectionPool = new Pool({
  user: process.env.DB_POSTGRES_USER,
  host: "aws-0-ap-southeast-1.pooler.supabase.com",
  database: "postgres",
  password: process.env.DB_POSTGRES_PASSWORD,
  port: "6543",
});

export default connectionPool;
