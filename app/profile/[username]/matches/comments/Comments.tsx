'use client';
import { useState } from 'react';
import { Comment } from '../../../../../database/comments';
import { CommentResponseBodyPost } from '../../../../api/matches/comments/route';
import styles from './page.module.scss';

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
  const user = props.user;
  const match = props.match;
  const comments = props.comments;
  const userId = user.id;
  const matchId = match.id;
  // const [errors, setErrors] = useState([]);
  // const router = useRouter();
  // const { username } = router.query;

  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        <div className={styles.username}>{match.username}</div>
        <div className={styles.formDiv}>
          <form
            className={styles.form}
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
            }}
          >
            <label htmlFor="comment">Your comment:</label>
            <textarea
              placeholder="Enter a comment..."
              id="comment"
              onChange={(event) => {
                setCommentInput(event.currentTarget.value);
              }}
            />
            <button className={styles.button}>Add comment</button>
          </form>
          <div className={styles.commentDiv}>
            {' '}
            {comments.map((comment: Comment) => {
              return (
                <div key={`user-${comment.id}`}>
                  <div>{comment.comment}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
