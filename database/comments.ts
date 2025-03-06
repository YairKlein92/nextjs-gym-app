import { cache } from 'react';
import { sql } from './connect';

export type Comment = {
  id: number;
  userId: number;
  matchId: number;
  comment: string;
  isVisible: boolean;
};

export const addComment = cache(
  async (
    user_id: number,
    match_id: number,
    the_comment: string,
    is_visible: boolean,
  ) => {
    const [comment] = await sql<Comment[]>`
      INSERT INTO comments (user_id, match_id, comment, is_visible)
      VALUES (${user_id}, ${match_id}, ${the_comment}, ${is_visible})
    `;
    return comment;
  },
);
export const removeComment = cache(async (commentId: number) => {
  const comment = await sql<Comment[]>`
UPDATE
comments
SET
is_visible = false
WHERE
id = ${commentId}
`;
  return comment;
});

export const getUserCommentsByMatchId = cache(
  async (user_id: number, match_id: number) => {
    const comments = await sql<Comment[]>`
    SELECT
      *
    FROM
      comments
      WHERE user_id = ${user_id} AND match_id = ${match_id}
    `;
    return comments;
  },
);
export const getUserCommentsByMatchIdAndVisibility = cache(
  async (user_id: number, match_id: number, is_visible: boolean) => {
    const [comments] = await sql<Comment[]>`
    SELECT
      *
    FROM
      comments
      WHERE user_id = ${user_id} AND match_id = ${match_id} AND is_visible = ${is_visible}
    `;
    return comments;
  },
);
