import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { removeComment } from '../../../../../../database/comments';

const commentSchma = z.object({
  userId: z.number(),
  matchId: z.number(),
  commentInput: z.string(),
  isVisible: z.boolean(),
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
        isVisible: boolean;
      };
    };

export const PUT = async (request: NextRequest) => {
  // Validating the data
  const body = await request.json();
  const result = commentSchma.safeParse(body);
  if (!result.success) {
    // inside the if statement, result.error.issues there is more information about what is allowing you to create more specific error messages
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  // create the match
  const updatedComment = await removeComment(
    result.data.userId,
    result.data.matchId,
    result.data.commentInput,
    result.data.isVisible,
  );
  // return the new username
  return NextResponse.json({ comment: { isVisible: false } });
};
