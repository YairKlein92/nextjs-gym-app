import { cache } from 'react';
import { sql } from './connect';

type User = {
  id: number;
  username: string;
  password: string;
  mail: string;
  age: number;
  mobile: string | null;
  isShredding: boolean | null;
  isBulking: boolean | null;
  isExperienced: boolean | null;
};
// get all comedians
export const getUsers = cache(async () => {
  const users = await sql<User[]>`
  SELECT * FROM users
  `;
  return users;
});

// get a single comedian

export const getUser = cache(async (id: number) => {
  const [user] = await sql<User[]>`
  SELECT * FROM
    users
    WHERE id = ${id}
  `;
  return user;
});
