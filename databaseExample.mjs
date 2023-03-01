import { config } from 'dotenv-safe';
import postgres from 'postgres';

// reads the variables from .env file, so it has to be up here
config();

const sql = postgres(); // because of config() we don't need any info here

console.log(
  await sql`
  SELECT * FROM users
  `,
);
await sql.end();
