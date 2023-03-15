'use client';

import styles from './page.module.scss';

export type User = {
  id: number;
  passwordHash: string;
  username: string;
  mail: string;
  age: number;
  mobile: string;
  isShredding: boolean;
  isBulking: boolean;
  isExperienced: boolean;
};
export type Props = {
  user: User;
  matches: User[];
};
export default function MatchesPage(props: Props) {
  const matches = props.matches;
  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        <h1>Your matches</h1>
        {matches.map((match) => (
          <div key={`user-${match.id}`} className={styles.matchDiv}>
            <div>{match.username}</div>
            <div>Age: {match.age}</div>
            <div>Mail:{match.mail}</div>
            <div>Mobile phone:{match.mobile}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
