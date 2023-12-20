import { notFound } from 'next/navigation';
import {
  addMatch,
  getBlockedUsersById,
  getSentOrReceivedRequestsFromDatabase,
} from '../../../../database/matches';
import { getUserByUsername, getUsers } from '../../../../database/users';
import PotentialBuddyProfile from './PotentialBuddies';

// type Props = { params: { username: string } };
export default async function PotentialBuddyPage({ params }) {
  const user = await getUserByUsername(params.username);
  // const matches = await getMatchRequestById(user.id);
  // console.log('matches on potentialBuddy component ->', matches);
  const users = await getUsers();
  const blockedUsers = await getBlockedUsersById(user.id);
  if (!user) {
    notFound();
  }

  const listOfUsersWithoutMe = users.filter((buddy) => buddy.id !== user.id);

  const mySentOrReceivedRequests = await getSentOrReceivedRequestsFromDatabase(
    user.id,
  );

  // BUG - mySentOrReceivedRequests is undefined
  const filteredUsers = listOfUsersWithoutMe.filter((currentUser) => {
    if (mySentOrReceivedRequests !== undefined) {
      return !mySentOrReceivedRequests.some((match) => {
        return (
          currentUser.id === match.userPendingId ||
          currentUser.id === match.userRequestingId
        );
      });
    } else {
      return true;
    }
  });

  const filteredUsersWithoutBlockedUsers = filteredUsers.filter((theUser) => {
    return !blockedUsers?.some((blockedUser) => blockedUser.id === theUser.id);
  });

  // }
  const button = ({ label, user1_id, user2_id }) => {
    // : React.FC<ButtonProps>
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
      listOfUsersWithoutMe={filteredUsersWithoutBlockedUsers}
      blockedUsers={blockedUsers}
    />
  );
}
