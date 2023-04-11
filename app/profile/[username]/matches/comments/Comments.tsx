'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import { Comment } from '../../../../../database/comments';
import { CommentResponseBodyPost } from '../../../../api/matches/comments/route';
import styles from './page.module.scss';

export type CommentProps = {
  comments: {
    id: number;
    userId: number;
    matchId: number;
    comment: string;
    isVisible: boolean;
  }[];
  match: { id: number; username: string };
  user: { id: number; username: string };
};
export default function CommentsPage(props: CommentProps) {
  const router = useRouter();
  const [commentInput, setCommentInput] = useState('');
  const user = props.user;
  const match = props.match;
  const comments = props.comments;
  const userId = user.id;
  const matchId = match.id;
  const isVisible = true;
  // const [errors, setErrors] = useState([]);
  // const router = useRouter();
  // const { username } = router.query;
  const onClickhandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const response = await fetch('/api/matches/comments/actions/remove', {
      method: 'PUT',
      body: JSON.stringify({
        userId,
        matchId,
        commentInput,
        isVisible: false,
      }),
    });
    const data: CommentResponseBodyPost = await response.json();
    console.log(data);
    router.refresh();
  };
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
                  isVisible,
                }),
              });
              const data: CommentResponseBodyPost = await response.json();
              console.log(data);
              router.refresh();
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
            {comments.map((comment: any) => {
              return (
                <div key={`user-${comment.id}`}>
                  <div>
                    {comment.comment}{' '}
                    <button onClick={onClickhandler}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
