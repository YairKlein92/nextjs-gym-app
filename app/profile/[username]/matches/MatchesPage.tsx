'use client';
import Link from 'next/link';
import { User, Users } from '../../../../database/users';
import styles from './page.module.scss';

export type Props = {
  user: User;
  matchesFromJointTable: Users;
};
export default function MatchesPage(props: Props) {
  const matches = props.matchesFromJointTable;
  const user = props.user;
  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        <div className={styles.titleDiv}>Your matches</div>
        {matches.map((match) => (
          <div key={`user-${match.id}`} className={styles.matchMainDiv}>
            <div className={styles.descriptionDiv}>
              <div className={styles.username}>
                {match.username}({match.age})
              </div>
              <div>Mail:{match.mail}</div>
              <div>Phone:{match.mobile}</div>{' '}
              <Link
                href={`/profile/${user.username}/matches/comments?username=${match.username}`}
              >
                <button className={styles.button}>Go</button>
              </Link>
            </div>
            <div>
              <img
                src={match.profilePicture}
                className={styles.profilePic}
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
