import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { acceptMatchInDatabase } from '../../../database/matches';

const matchSchema = z.object({
  userRequestingId: z.number(),
  userPendingId: z.number(),
  isRequested: z.boolean(),
  isAccepted: z.boolean(),
});

export type AcceptDenyMatchResponseBody =
  | {
      errors: { message: string }[];
    }
  | {
      match: {
        userRequestingId: string;
        userPendingId: string;
        isRequested: boolean;
        isAccepted: boolean;
      };
    };

export const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const result = matchSchema.safeParse(body);
  if (!result.success) {
    // inside the if statement, result.error.issues there is more information about what is allowing you to create more specific error messages
    console.error('Request body does not match expected schema:', result.error);
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  try {
    // create accept
    const newMatch = await acceptMatchInDatabase(
      result.data.userRequestingId,
      result.data.userPendingId,
    );
    console.log(newMatch);
    return NextResponse.json({
      match: { isRequested: false, isAccepted: true },
    });
  } catch (error) {
    console.error('Failed to accept request:', error);
    return NextResponse.json(
      { error: [{ message: 'Failed to accept request.' }] },
      { status: 500 },
    );
  }
};
