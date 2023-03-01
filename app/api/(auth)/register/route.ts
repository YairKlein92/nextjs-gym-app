import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser, getUserByUsername } from '../../../../database/users';

const userSchma = z.object({
  username: z.string(),
  password: z.string(),
  mail: z.string(),
  age: z.number(),
  mobile: z.string(),
  isShredding: z.boolean(),
  isBulking: z.boolean(),
  isExperienced: z.boolean(),
});

export type RegisterResponseBody =
  | {
      error: { message: string }[];
    }
  | { user: { username: string } };

export const POST = async (request: NextRequest) => {
  // Validating the data
  const body = await request.json();

  const result = userSchma.safeParse(body);

  if (!result.success) {
    // inside the if statement, result.error.issues there is more information about what is allowing you to create more specific error messages
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  // checking if the string is empty
  if (!result.data.username || !result.data.password) {
    return NextResponse.json(
      { error: [{ message: 'Username and password are required' }] },
      { status: 400 },
    );
  }
  // checking if the username is already taken
  // compare the username with the database
  const user = await getUserByUsername(result.data.username);
  if (user) {
    return NextResponse.json(
      { error: [{ message: 'Username has already been taken' }] },
      { status: 400 },
    );
  }
  //  hash the password
  const passwordHash = await bcrypt.hash(result.data.password, 12);

  // create the user
  const newUser = await createUser(
    result.data.username,
    passwordHash,
    result.data.mail,
    result.data.age,
    result.data.mobile,
    result.data.isShredding,
    result.data.isBulking,
    result.data.isExperienced,
  );
  if (!newUser) {
    return NextResponse.json(
      {
        errors: [
          {
            message:
              'Creating the user was not succesful - username is already taken',
          },
        ],
      },
      { status: 400 },
    );
  }
  // return the new username
  return NextResponse.json({ user: { username: newUser.username } });
};
