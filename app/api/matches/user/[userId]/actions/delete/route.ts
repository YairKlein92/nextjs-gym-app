import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { deleteMatchInDatabase } from '../../../../../../../database/matches';

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
    // Error handling if the body doesn't match the schema
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  // create delete
  const newMatch = await deleteMatchInDatabase(
    result.data.userRequestingId,
    result.data.userPendingId,
  );
  console.log('newMatch in delete/route.ts', newMatch);
  return NextResponse.json({
    match: {
      userRequestingId: result.data.userRequestingId,
      userPendingId: result.data.userPendingId,
      isRequested: false,
      isAccepted: false,
      isBlocked: false,
    },
  });
};
