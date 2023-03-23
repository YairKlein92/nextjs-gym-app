'use client';
import { useState } from 'react';
import { Comment } from '../../../../../database/comments';
import { CommentResponseBodyPost } from '../../../../api/matches/comments/route';

export type CommentProps = {
  comments: {
    id: number;
    userId: number;
    matchId: number;
    comment: string;
  }[];
  match: { id: number; username: string };
  user: { id: number; username: string };
};
export default function CommentsPage(props: CommentProps) {
  const [commentInput, setCommentInput] = useState('');
  console.log(props);
  const user = props.user;
  const match = props.match;
  const comments = props.comments;
  const userId = user.id;
  const matchId = match.id;
  // const [errors, setErrors] = useState([]);
  // const router = useRouter();
  // const { username } = router.query;

  return (
    <>
      <div>{match.username}</div>
      <form
        action=""
        onSubmit={async (event) => {
          event.preventDefault();

          const response = await fetch('/api/matches/comments', {
            method: 'POST',
            body: JSON.stringify({
              userId,
              matchId,
              commentInput,
            }),
          });
          const data: CommentResponseBodyPost = await response.json();
          console.log(data);
          // if ('errors' in data) {
          //   setErrors(data.errors);
          //   return;
          // }
        }}
      >
        <label htmlFor="comment">Your comment:</label>
        <input
          id="comment"
          onChange={(event) => {
            setCommentInput(event.currentTarget.value);
          }}
        />
        <button>Add comment</button>
      </form>
      {comments.map((comment: Comment) => {
        return (
          <div key={`user-${comment.id}`}>
            <div>{comment.comment}</div>
          </div>
        );
      })}
    </>
  );
}
