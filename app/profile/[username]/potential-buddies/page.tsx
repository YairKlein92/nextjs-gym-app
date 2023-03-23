import { notFound } from 'next/navigation';
import {
  addMatch,
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
  console.log('user on PotentialBuddyPage', user.id);

  const users: any = await getUsers();

  if (!user) {
    notFound();
  }
  const listOfUsersWithoutMe: Users = users.filter(
    (buddy: User) => buddy.id !== user.id,
  );
  const myMatchesFromDatabase = await getUserMatchesFromDatabase(user.id);
  console.log('matchesFromDatabase', myMatchesFromDatabase);

  for (const userInList in listOfUsersWithoutMe) {
    for (const match in myMatchesFromDatabase) {
      if (userInList.id === match.userPendingId) {
        listOfUsersWithoutMe.splice(user, 1);
      }
    }
  }
  console.log('listOfUsersWithoutMe after filtering', listOfUsersWithoutMe);
  // const finalListOfPotentialBuddies = listOfUsersWithoutMe.filter(
  //     (buddy: User) =>
  //       buddy.userPendingId ===
  //       )
  const Button: React.FC<ButtonProps> = ({ label, user1_id, user2_id }) => {
    async function handleButtonClick() {
      const result = await addMatch(user1_id, user2_id, false);
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
      listOfUsersWithoutMe={listOfUsersWithoutMe}
    />
  );
}
