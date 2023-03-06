import { cache } from 'react';
import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  passwordHash: string;
  mail: string;
  age: number;
  mobile: string | null;
  isShredding: boolean | null;
  isBulking: boolean | null;
  isExperienced: boolean | null;
};
// get all users
export const getUsers = cache(async () => {
  const users = await sql<User[]>`
  SELECT * FROM users
  `;
  return users;
});

type UserWithPasswordHash = User & {
  passwordHash: string;
};

export const getUserBySessionToken = cache(async (token: string) => {
  const [user] = await sql<
    { id: number; username: string; csrfSecret: string }[]
  >`
    SELECT
      users.id,
      users.username,
      sessions.csrf_secret
    FROM
      users
    INNER JOIN
      sessions ON (
        sessions.token = ${token} AND
        sessions.user_id = users.id AND
        sessions.expiry_timestamp > now()
      )
  `;
  return user;
});

export const getUserByUsernameWithPasswordHash = cache(
  async (username: string) => {
    const [user] = await sql<UserWithPasswordHash[]>`
    SELECT
      *
    FROM
      users
    WHERE
      username = ${username}
  `;
    return user;
  },
);

export const getUserByUsername = cache(async (username: string) => {
  const [user] = await sql<Omit<User, 'password'>[]>`
  SELECT * FROM
    users
    WHERE username = ${username}
  `;
  return user;
});

export const createUser = cache(
  async (
    username: string,
    passwordHash: string,
    mail: string,
    age: number,
    mobile: string,
    isShredding: boolean,
    isBulking: boolean,
    isExperienced: boolean,
  ) => {
    // declaration for the query
    const [user] = await sql<Omit<User, 'password'>[]>`
      INSERT INTO users (username, password_hash, mail, age, mobile, is_shredding, is_bulking, is_experienced)
      VALUES (${username}, ${passwordHash}, ${mail}, ${age}, ${mobile}, ${isShredding}, ${isBulking}, ${isExperienced})
      RETURNING
        id,
        username,
        mail,
        age,
        mobile,
        is_shredding,
        is_bulking,
        is_experienced
      `;
    return user;
  },
);
