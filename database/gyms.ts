import { cache } from 'react';
import { sql } from './connect';

export type Gym = {
  id: number;
  gymName: string;
  gymAddress: string;
  gymPostalCode: string;
  gymLink: string;
};
export type Gyms = {
  id: number;
  gymName: string;
  gymAddress: string;
  gymPostalCode: string;
  gymLink: string;
}[];
export type FavouriteGym = {
  id: number;
  userId: number;
  gymId: number;
}[];

// get all gyms
export const getGyms = cache(async () => {
  const gymsNames = await sql<Gym[]>`
  SELECT * FROM gyms
  `;
  return gymsNames;
});

// returns undefined when working on EditProfile!!
// https://www.youtube.com/watch?v=2X_qXnPg6G0&ab_channel=Amigoscode
export const getFavouriteGymByUserId = cache(async (id: number) => {
  // Perform a JOIN between the users and gyms table to get the gym name directly
  const gym = await sql<FavouriteGym>`
    SELECT gyms.gym_name
    FROM users
    JOIN gyms ON gyms.id = CAST(users.favourite_gym AS INTEGER)    WHERE users.id = ${id};
  `;

  // Return the gym name or null if no result found
  return gym;
});
export const createFavouriteGymforUser = cache(
  async (userId: number, gymId: number) => {
    const [favouriteGym] = await sql<FavouriteGym[]>`
      INSERT INTO favourite_gyms (user_id, gym_id)
      VALUES (${userId}, ${gymId})
      RETURNING id, user_id, gym_id
  `;
    return favouriteGym;
  },
);
