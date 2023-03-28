import { Pool } from 'pg'; // Client
import { cache } from 'react';
import { sql } from './connect';

// const db = new Client({
//   user: 'nextjs_gym_app',
//   password: 'nextjs_gym_app',
//   host: 'localhost',
//   port: 5432,
//   database: 'nextjs_gym_app',
// });
export type Props = {
  params: { username: string };
  searchParams: { username: string };
};
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
  profilePicture: string;
};
export type UserWithoutPassword = Omit<User, 'password'>;

export type Users = {
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
  profilePicture: string;
}[];

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
type UserWithGyms = {
  usersId: number;
  usersUsername: string;
  gymsId: number;
  gymsName: string;
};
export const getUserById = cache(async (id: number) => {
  const [user] = await sql<User[]>`
  SELECT * FROM users WHERE id = ${id}
  `;
  return user;
});

export const getUsersByIds = cache(async (ids: number[]) => {
  const users = await sql`
    SELECT *
    FROM users
    WHERE id IN ${sql(ids)};
  `;
  return users;
});

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

const pool = new Pool({
  user: 'nextjs_gym_app',
  password: 'nextjs_gym_app',
  host: 'localhost',
  port: 5432,
  database: 'nextjs_gym_app',
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
    profilePicture: string,
  ) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert into the users table
      const userInsertResult = await client.query<Omit<User, 'password'>>({
        text: `
          INSERT INTO users (username, password_hash, mail, age, mobile, is_shredding, is_bulking, is_experienced, profile_picture)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id, username, mail, age, mobile, is_shredding, is_bulking, is_experienced, profile_picture
        `,
        values: [
          username,
          passwordHash,
          mail,
          age,
          mobile,
          isShredding,
          isBulking,
          isExperienced,
          profilePicture,
        ],
      });
      const user = userInsertResult.rows[0];

      // Insert into the favourite_gyms join table
      await client.query({
        text: `
          INSERT INTO favourite_gyms (user_id, gym_id)
          VALUES ($1, $2)
        `,
        values: [user?.id, favouriteGym],
      });

      await client.query('COMMIT');
      return user;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
);

export const updateUser = cache(
  async (
    id: number,
    username: string,
    mail: string,
    age: number,
    mobile: string,
    favouriteGym: string,
    isShredding: boolean,
    isBulking: boolean,
    isExperienced: boolean,
    profilePicture: string,
  ) => {
    const [userUpdate] = await sql<Omit<User, 'password'>[]>`
    UPDATE users
    SET username= ${username}, mail = ${mail}, age = ${age}, mobile = ${mobile}, favourite_gym = ${favouriteGym}, is_shredding = ${isShredding}, is_bulking = ${isBulking}, is_experienced = ${isExperienced}, profile_picture = ${profilePicture}
    WHERE id = ${id}
    RETURNING username, mail, age, mobile, is_shredding, is_bulking, is_experienced, profile_picture, id
  `;
    return userUpdate;
  },
);
export const updateProfilePicture = cache(
  async (id: number, profilePicture: string) => {
    const [userProfilePictureUpdate] = await sql<Omit<User, 'password'>[]>`
    UPDATE users
    SET  profile_picture = ${profilePicture}
    WHERE id = ${id}
    RETURNING username, mail, age, mobile, is_shredding, is_bulking, is_experienced, profile_picture, id
  `;
    return userProfilePictureUpdate;
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
