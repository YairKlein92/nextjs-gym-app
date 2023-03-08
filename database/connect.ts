import { config } from 'dotenv-safe';
import postgres from 'postgres';

config();
// if (!process.env.FLY_IO)
export const sql = postgres({
  transform: {
    ...postgres.camel,
    undefined: null,
  },
});
