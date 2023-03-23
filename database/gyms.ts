import { cache } from 'react';
import { sql } from './connect';

export type Gym = {
  id: number;
  gymName: string;
  gymAddress: string;
  gymPostalCode: string;
};
export type Gyms = {
  id: number;
  gymName: string;
  gymAddress: string;
  gymPostalCode: string;
}[];

// get all gyms
export const getGyms = cache(async () => {
  const gymsNames = await sql<Gym[]>`
  SELECT * FROM gyms
  `;
  return gymsNames;
});

export const getFavouriteGymsByUserId = cache(async (id: number) => {
  const [gym] = await sql<Gym[]>`
  SELECT
    gyms.*
  FROM
    users
  JOIN
    favourite_gyms ON favourite_gyms.user_id = users.id
  JOIN
    gyms ON gyms.id = favourite_gyms.gym_id
  WHERE
    users.id = ${id};
  `;
  return gym;
});
