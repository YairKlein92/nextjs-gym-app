import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserBySessionToken, updateUser } from '../../../../database/users';

// Define the schema for the user data
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

// PUT request handler
export async function PUT(request) {
  // Retrieve session token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken');

  // Parse request body
  const body = await request.json();
  const result = userSchema.safeParse(body);

  // If validation fails, return a 400 response with errors
  if (!result.success) {
    return NextResponse.json({ errors: result.error.issues }, { status: 400 });
  }

  // Get user by session token
  const existingUser = token && (await getUserBySessionToken(token.value));

  // If user is not found, return a 404 response
  if (!existingUser) {
    return NextResponse.json(
      { errors: [{ message: 'User not found' }] },
      { status: 404 },
    );
  }

  // Create updated user object from parsed data
  const user = {
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

  // Check for authorization
  if (existingUser.id !== user.id) {
    return NextResponse.json(
      { errors: [{ message: 'Unauthorized' }] },
      { status: 401 },
    );
  }

  try {
    // Update the user in the database
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

    // Respond with the updated user information
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { errors: [{ message: 'Failed to update user' }] },
      { status: 500 },
    );
  }
}
