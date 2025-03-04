import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { denyMatchInDatabase } from '../../../../../../../database/matches';

const matchSchema = z.object({
  userRequestingId: z.number(),
  userReceivingId: z.number(),
  isPending: z.boolean(),
  isAccepted: z.boolean(),
  isDenied: z.boolean(),
  isBlocked: z.boolean(),
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
        isDenied: boolean;
        isBlocked: boolean;
      };
    };
// update
export const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const result = matchSchema.safeParse(body);
  if (!result.success) {
    // inside the if statement, result.error.issues there is more information about what is allowing you to create more specific error messages
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  // create deny
  const newMatch = await denyMatchInDatabase(
    result.data.userRequestingId,
    result.data.userReceivingId,
  );
  console.log('newMatch in accept/route.ts', newMatch);
  return NextResponse.json({
    match: {
      isPending: false,
      isAccepted: false,
      isDenied: true,
      isBlocked: false,
    },
  });
};
