import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getUserByUsername,
  updateUser,
  User,
  UserUpdate,
} from '../../../database/users';

const userSchema = z.object({
  username: z.string(),
  mail: z.string(),
  age: z.number(),
  mobile: z.string(),
  favouriteGym: z.string(),
  isShredding: z.boolean(),
  isBulking: z.boolean(),
  isExperienced: z.boolean(),
});

export type UpdateProfileResponseBodyPost =
  | {
      errors: { message: string }[];
    }
  | {
      user: {
        username: string;
        mail: string;
        age: number;
        mobile: string;
        favouriteGym: string;
        isShredding: boolean;
        isBulking: boolean;
        isExperienced: boolean;
      };
    };

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const result = userSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const user: UserUpdate = {
    username: result.data.username,
    mail: result.data.mail,
    age: result.data.age,
    mobile: result.data.mobile,
    favouriteGym: result.data.favouriteGym,
    isShredding: result.data.isShredding,
    isBulking: result.data.isBulking,
    isExperienced: result.data.isExperienced,
  };

  const existingUser = await getUserByUsername(user.username);
  if (!existingUser) {
    return NextResponse.json(
      { error: [{ message: 'User not found' }] },
      { status: 404 },
    );
  }

  try {
    await updateUser(user);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: [{ message: 'Failed to update user' }] },
      { status: 500 },
    );
  }
};
