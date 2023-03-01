import { config } from 'dotenv-safe';
import postgres from 'postgres';

if (!process.env.FLY_IO) config();

export const sql = postgres({
  transform: {
    ...postgres.camel,
    undefined: null,
  },
});
