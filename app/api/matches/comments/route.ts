import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addComment } from '../../../../database/comments';

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

export const POST = async (request: NextRequest) => {
  // Validating the data
  const body = await request.json();
  const result = commentSchma.safeParse(body);
  if (!result.success) {
    // inside the if statement, result.error.issues there is more information about what is allowing you to create more specific error messages
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const newComment = await addComment(
    result.data.userId,
    result.data.matchId,
    result.data.commentInput,
    result.data.isVisible,
  );
  console.log('newComment', newComment);

  return NextResponse.json({ comment: { isVisible: true } });
};
