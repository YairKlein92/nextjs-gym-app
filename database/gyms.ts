import { cache } from 'react';
import { sql } from './connect';
import { Gym } from './users';

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
