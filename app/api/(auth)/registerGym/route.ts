import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createFavouriteGymforUser } from '../../../../database/gyms';

const gymSchema = z.object({
  userId: z.number(),
  gymId: z.number(),
});

export type RegisterResponseBodyPost =
  | {
      errors: { message: string }[];
    }
  | {
      favouriteGym: {
        userId: number;
        gymId: number;
      };
    };

export const POST = async (request: NextRequest) => {
  // Validating the data
  const body = await request.json();
  const result = gymSchema.safeParse(body);
  console.log('result of favourite gym:', result);
  if (!result.success) {
    // inside the if statement, result.error.issues there is more information about what is allowing you to create more specific error messages
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  // create favourite gym
  const newFavouriteGym = await createFavouriteGymforUser(
    result.data.userId,
    result.data.gymId,
  );
  console.log('new favourite gym', newFavouriteGym);
};
