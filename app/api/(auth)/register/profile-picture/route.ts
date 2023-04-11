import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getUserBySessionToken,
  updateProfilePicture,
} from '../../../../../database/users';

const userSchema = z.object({
  username: z.string(),
  mail: z.string(),
  age: z.number(),
  mobile: z.string(),
  favouriteGym: z.string(),
  isShredding: z.boolean(),
  isBulking: z.boolean(),
  isExperienced: z.boolean(),
  profilePicture: z.string(),
});

export type UpdateProfileResponseBodyPut =
  | {
      errors: { message: string }[];
    }
  | {
      user: {
        profilePicture: string;
      };
    };
export type UpdateProfilePicture = {
  id: number;
  profilePicture: string;
};

export async function PUT(
  request: NextRequest,
): Promise<NextResponse<number, UpdateProfileResponseBodyPut>> {
  const cookieStore = cookies();
  const token = cookieStore.get('sessionToken');

  const body = await request.json();
  const result = userSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.issues }, { status: 400 });
  }

  const existingUser = token && (await getUserBySessionToken(token.value));
  if (!existingUser) {
    return NextResponse.json(
      { errors: [{ message: 'User not found' }] },
      { status: 404 },
    );
  }

  const user: UpdateProfilePicture = {
    id: existingUser.id,
    profilePicture: result.data.profilePicture,
  };

  if (existingUser.id !== user.id) {
    return NextResponse.json(
      { errors: [{ message: 'Unauthorized' }] },
      { status: 401 },
    );
  }

  try {
    await updateProfilePicture(existingUser.id, user.profilePicture);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { errors: [{ message: 'Failed to update user' }] },
      { status: 500 },
    );
  }
}
