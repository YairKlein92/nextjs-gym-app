'use client';
import { useState } from 'react';
import { CommentResponseBodyPost } from '../../../../api/matches/comments/route';

export default function CommentsPage(props: any) {
  const [comment, setComment] = useState('');
  console.log(props);
  const match = props.match;
  const user = props.user;
  const userId = user.id;
  const matchId = match.id;
  const [errors, setErrors] = useState([]);
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
              comment,
            }),
          });
          const data: CommentResponseBodyPost = await response.json();
          console.log(data);
          if ('errors' in data) {
            setErrors(data.errors);
            return;
          }
        }}
      >
        <label htmlFor="comment">Your comment:</label>
        <input
          id="comment"
          onChange={(event) => {
            setComment(event.currentTarget.value);
          }}
        />
        <button>Send</button>
      </form>
      {comment}
    </>
  );
}
