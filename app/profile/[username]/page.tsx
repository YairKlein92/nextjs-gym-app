import Link from 'next/link';
// 'use client';
// import { GoogleApiWrapper, Map } from 'google-maps-react';
import { notFound } from 'next/navigation';
// import { Component } from 'react';
import { getUserByUsername, getUsers, User } from '../../../database/users';
import styles from './page.module.scss';

type Props = { params: { username: string } };

export default async function SearchProfile({ params }: Props) {
  console.log('on userprofile page', params);

  const user = await getUserByUsername(params.username);
  if (!user) {
    notFound();
  }
  const users = await getUsers();
  const potentialBuddie: User = users[1];
  const listOfUsersWithoutMe: User[] = users.filter(
    (buddy: User) => buddy.id !== user.id,
  );

  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        <div className={styles.headerDiv}>I am looking for...</div>
        <div className={styles.filterDiv}>
          <div className={styles.line}>Goals</div>
          <div className={styles.line}>Exp</div>
          <div className={styles.gymFilterDiv}>
            <div className={styles.line}>FitInn John Strasse</div>
            <div>afternoons</div>
          </div>
        </div>
        <div className={styles.potentialDiv}>
          <div>{listOfUsersWithoutMe.length} potencial gym buddies</div>
          <Link
            className={styles.link}
            href={`/profile/${user.username}/potentialBuddies`}
          >
            {' '}
            Watch them
          </Link>
        </div>
        <div className={styles.potentialDiv}>
          <div>Recommended for you</div>
          <Link className={styles.linkAccept} href="/">
            {' '}
            Yes!
          </Link>
        </div>
        <div className={styles.potentialBuddyDiv}>
          <div className={styles.descriptionDiv}>
            <div className={styles.buddyName}>{potentialBuddie.username}</div>
            {potentialBuddie.age} years old
            <div>{potentialBuddie.isBulking ? 'Bulking' : null}</div>
            <div>{potentialBuddie.isShredding ? 'Cutting' : null}</div>
            <div>
              {potentialBuddie.isExperienced ? 'Experienced' : null}
              <div>{users[1].mail}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default GoogleApiWrapper({
//   apiKey: 'apikey',
// })(MapContainer);

// class MapContainer extends Component {
//   render() {
//     return (
//       <Map
//         google={this.props.google}
//         style={{ width: '15%', height: '30%' }}
//         zoom={14}
//         initialCenter={{ lat: 48.192956, lng: 16.315233 }}
//       />
//     );
//   }
// }
