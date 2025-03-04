import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { acceptMatchInDatabase } from '../../../database/matches';

const matchSchema = z.object({
  userRequestingId: z.number(),
  userReceivingId: z.number(),
  isPending: z.boolean(),
  isAccepted: z.boolean(),
});

export type AcceptDenyMatchResponseBody =
  | {
      errors: { message: string }[];
    }
  | {
      match: {
        userRequestingId: string;
        userReceivingId: string;
        isPending: boolean;
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
      result.data.userReceivingId,
    );
    console.log('newMatch from route.ts', newMatch);
    return NextResponse.json({
      match: { isPending: false, isAccepted: true },
    });
  } catch (error) {
    console.error('Failed to accept request:', error);
    return NextResponse.json(
      { error: [{ message: 'Failed to accept request.' }] },
      { status: 500 },
    );
  }
};
