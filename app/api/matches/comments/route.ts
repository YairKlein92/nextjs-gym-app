import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addComment } from '../../../../database/comments';

const userSchma = z.object({
  userId: z.number(),
  matchId: z.number(),
  comment: z.string(),
});

export type CommentResponseBodyPost =
  | {
      errors: { message: string }[];
    }
  | {
      message: {
        userId: string;
        matchId: string;
        comment: string;
      };
    };

export const POST = async (request: NextRequest) => {
  // Validating the data
  const body = await request.json();
  const result = userSchma.safeParse(body);
  if (!result.success) {
    // inside the if statement, result.error.issues there is more information about what is allowing you to create more specific error messages
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  // create the match
  const newComment = await addComment(
    result.data.userId,
    result.data.matchId,
    result.data.comment,
  );
  console.log('new match:', newComment);
  // return the new username
  return NextResponse.json({ comment: { isAccepted: true } });
};
