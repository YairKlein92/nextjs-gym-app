import { cache } from 'react';
import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  passwordHash: string;
  mail: string;
  age: number;
  mobile: string | null;
  favouriteGym: string;
  isShredding: boolean | null;
  isBulking: boolean | null;
  isExperienced: boolean | null;
};
export type Gym = {
  id: number;
  gymName: string;
  gymAddress: string;
  gymPostalCode: string;
};

// get all users
export const getUsers = cache(async () => {
  const users = await sql<User[]>`
  SELECT * FROM users
  `;
  return users;
});

// get all gyms

export const getGyms = cache(async () => {
  const gymsNames = await sql<Gym[]>`
  SELECT * FROM gyms
  `;
  return gymsNames;
});

type UserWithPasswordHash = User & {
  passwordHash: string;
};
type UserWithGyms = {
  usersId: number;
  usersUsername: string;
  gymsId: number;
  gymsName: string;
};

export const getUserByIdWithGyms = cache(async (id: number) => {
  const data = await sql<UserWithGyms[]>`
  SELECT
    users.id AS user_id,
    users.username AS user_username,
    gyms.id AS gym_id,
    gyms.gym_name AS gym_name
  FROM
    users
  INNER JOIN favourite_gyms ON
  users.id = favourite_gyms.user_id
  INNER JOIN gyms ON
  favourite_gyms.gym_id = gyms.id
  WHERE users.id = ${id}
  `;
  return data;
});
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
    favouriteGym: string,
    isShredding: boolean,
    isBulking: boolean,
    isExperienced: boolean,
  ) => {
    // declaration for the query
    const [user] = await sql<Omit<User, 'password'>[]>`
      INSERT INTO users (username, password_hash, mail, age, mobile, favourite_gym, is_shredding, is_bulking, is_experienced)
      VALUES (${username}, ${passwordHash}, ${mail}, ${age}, ${mobile}, ${favouriteGym}, ${isShredding}, ${isBulking}, ${isExperienced})
      RETURNING
        id,
        username,
        mail,
        age,
        mobile,
        favourite_gym,
        is_shredding,
        is_bulking,
        is_experienced
      `;
    return user;
  },
);
