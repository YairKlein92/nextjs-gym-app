import { config } from 'dotenv-safe';
import postgres from 'postgres';

config();

// Log the loaded environment variable
console.log(process.env.DATABASE_URL);

const sql = postgres(); // because of config() we don't need any info here

await sql.end();
