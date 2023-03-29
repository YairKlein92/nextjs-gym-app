// import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateExistingProfilePicture } from '../../../../../../../database/users';

const userSchma = z.object({
  id: z.number(),
  profilePicture: z.string(),
});

export type RegisterResponseBodyPost =
  | {
      errors: { message: string }[];
    }
  | {
      user: {
        id: string;
        profilePicture: string;
      };
    };

export const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const result = userSchma.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const newImg = await updateExistingProfilePicture(
    result.data.id,
    result.data.profilePicture,
  );
  console.log(newImg);
  // return the new picture
  return NextResponse.json({
    user: {
      id: result.data.id,
      profilePicture: result.data.profilePicture,
    },
  });
};
