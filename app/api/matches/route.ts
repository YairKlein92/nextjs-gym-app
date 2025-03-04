import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addMatch } from '../../../database/matches';

const userSchma = z.object({
  userRequestingId: z.number(),
  userReceivingId: z.number(),
  isPending: z.boolean(),
  isAccepted: z.boolean(),
  isDenied: z.boolean(),
  isBlocked: z.boolean(),
});

export type RegisterResponseBodyPost =
  | {
      errors: { message: string }[];
    }
  | {
      match: {
        userRequestingId: string;
        userReceivingId: string;
        isPending: boolean;
        isAccepted: boolean;
        isDenied: boolean;
        isBlocked: boolean;
      };
    };

// upload
export const POST = async (request: NextRequest) => {
  // Validating the data
  const body = await request.json();
  const result = userSchma.safeParse(body);
  if (!result.success) {
    // inside the if statement, result.error.issues there is more information about what is allowing you to create more specific error messages
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  // create the match
  const newMatch = await addMatch(
    result.data.userRequestingId,
    result.data.userReceivingId,
    result.data.isPending,
    result.data.isAccepted,
    result.data.isDenied,
    result.data.isBlocked,
  );
  // return the new username
  return NextResponse.json({ match: { isAccepted: true, newMatch: newMatch } });
};
