import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getUserBySessionToken,
  updateUser,
  User,
} from '../../../../database/users';

const userSchema = z.object({
  username: z.string(),
  passwordHash: z.string(),
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
        username: string;
        passwordHash: string;
        mail: string;
        age: number;
        mobile: string;
        favouriteGym: string;
        isShredding: boolean;
        isBulking: boolean;
        isExperienced: boolean;
      };
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

  const user: User = {
    id: existingUser.id,
    username: result.data.username,
    passwordHash: result.data.passwordHash,
    mail: result.data.mail,
    age: result.data.age,
    mobile: result.data.mobile,
    favouriteGym: result.data.favouriteGym,
    isShredding: result.data.isShredding,
    isBulking: result.data.isBulking,
    isExperienced: result.data.isExperienced,
    profilePicture: result.data.profilePicture,
  };

  if (existingUser.id !== user.id) {
    return NextResponse.json(
      { errors: [{ message: 'Unauthorized' }] },
      { status: 401 },
    );
  }

  try {
    await updateUser(
      existingUser.id,
      user.username,
      user.mail,
      user.age,
      user.mobile,
      user.favouriteGym,
      user.isShredding,
      user.isBulking,
      user.isExperienced,
      user.profilePicture,
    );

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { errors: [{ message: 'Failed to update user' }] },
      { status: 500 },
    );
  }
}
