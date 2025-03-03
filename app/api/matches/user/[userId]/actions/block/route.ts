import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { blockMatchInDatabase } from '../../../../../../../database/matches';

const matchSchema = z.object({
  userRequestingId: z.number(),
  userPendingId: z.number(),
  isRequested: z.boolean(),
  isAccepted: z.boolean(),
  isBlocked: z.boolean(),
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
        isBlocked: boolean;
      };
    };

export const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const result = matchSchema.safeParse(body);
  if (!result.success) {
    // inside the if statement, result.error.issues there is more information about what is allowing you to create more specific error messages
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  // create deny
  const newMatch = await blockMatchInDatabase(
    result.data.userRequestingId,
    result.data.userPendingId,
  );
  console.log('newMatch in block/route.ts', newMatch);
  return NextResponse.json({
    match: { isRequested: false, isAccepted: false, isBlocked: true },
  });
};
