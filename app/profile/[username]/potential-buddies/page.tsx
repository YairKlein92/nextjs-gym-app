import { notFound } from 'next/navigation';
import {
  addMatch,
  getNegativelyAnsweredMatchRequestById,
  getUserMatchesFromDatabase,
} from '../../../../database/matches';
import {
  getUserByUsername,
  getUsers,
  User,
  Users,
} from '../../../../database/users';
import PotentialBuddyProfile from './PotentialBuddies';

type Props = { params: { username: string } };
export default async function PotentialBuddyPage({ params }: Props) {
  const user: any = await getUserByUsername(params.username);
  // const matches = await getMatchRequestById(user.id);
  // console.log('matches on potentialBuddy component ->', matches);
  const users: any = await getUsers();
  const deniedUsers = await getNegativelyAnsweredMatchRequestById(user.id);
  if (!user) {
    notFound();
  }
  const listOfUsersWithoutMe: Users = users.filter(
    (buddy: User) => buddy.id !== user.id,
  );

  const mySentOrReceivedRequests = await getUserMatchesFromDatabase(user.id);

  const filteredUsers = listOfUsersWithoutMe.filter((otherUser: User) => {
    return !mySentOrReceivedRequests.some((match: any) => {
      return (
        otherUser.id === match.userPendingId ||
        otherUser.id === match.userRequestingId
      );
    });
  });
  const filteredUsersWithBlockedUsers = filteredUsers.filter(
    (otherUser: User) => {
      return deniedUsers.some(
        (deniedUser) =>
          deniedUser.id === otherUser.id && deniedUser.isBlocked === true,
      );
    },
  );
  const Button: React.FC<ButtonProps> = ({ label, user1_id, user2_id }) => {
    async function handleButtonClick() {
      const result = await addMatch(user1_id, user2_id, true, false, false);
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    }

    return <button onClick={handleButtonClick}>{label}</button>;
  };

  return (
    <PotentialBuddyProfile
      user={user}
      listOfUsersWithoutMe={filteredUsersWithBlockedUsers}
    />
  );
}

// OLD CODE
// const listOfUsersWithoutMe: Users = users.filter(
//   (buddy: User) => buddy.id !== user.id,
// );
// const mySentOrReceivedRequests = await getUserMatchesFromDatabase(user.id);
// for (const otherUsers in listOfUsersWithoutMe) {
//   for (const match in mySentOrReceivedRequests) {
//     if (
//       otherUsers.id === match.userPendingId ||
//       otherUsers.id === match.userRequestingId
//     ) {
//       listOfUsersWithoutMe.splice(user, 1);
//     }
//   }
// }
