import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { deleteMatchInDatabase } from '../../../../../../../database/matches';

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
      errors: { message: string }[]; // Return errors in a structured way
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

export const DELETE = async (request: NextRequest) => {
  const body = await request.json();
  const result = matchSchema.safeParse(body);

  if (!result.success) {
    // Handle errors if schema validation fails
    return NextResponse.json(
      {
        errors: result.error.issues.map((issue) => ({
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  try {
    // Delete the match from the database
    const deletedMatch = await deleteMatchInDatabase(
      result.data.userRequestingId,
      result.data.userReceivingId,
    );

    // You may log the result for debugging purposes
    console.log('Match deleted from database:', deletedMatch);

    // Return the updated match state after deletion
    return NextResponse.json({
      match: {
        userRequestingId: result.data.userRequestingId.toString(),
        userReceivingId: result.data.userReceivingId.toString(),
        isPending: false,
        isAccepted: false,
        isDenied: true,
        isBlocked: false,
      },
    });
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json(
      { errors: [{ message: 'Failed to delete the match from the database' }] },
      { status: 500 },
    );
  }
};
