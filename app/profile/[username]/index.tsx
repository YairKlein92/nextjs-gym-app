// import { ChakraProvider, theme } from '@chakra-ui/react';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './page';

// ReactDOM.render(
//   <React.StrictMode>
//     <ChakraProvider theme={theme}>
//       <App />
//     </ChakraProvider>
//   </React.StrictMode>,
//   document.getElementById('root'),
// );
import { notFound } from 'next/navigation';
import { getFavouriteGymsByUserId } from '../../../database/gyms';
import { getUserByUsername, getUsers, User } from '../../../database/users';
import ProfilePage from './ProfilePage';

export default function UserProfile({ user }: { user: User }) {
  const favouriteGym = getFavouriteGymsByUserId(user.id);
  const users = getUsers();
  const potentialBuddie: User = users[1];
  const listOfUsersWithoutMe: User[] = users.filter(
    (buddy: User) => buddy.id !== user.id,
  );

  if (!user) {
    notFound();
  }

  return (
    <ProfilePage
      user={user}
      users={users}
      favouriteGym={favouriteGym}
      potentialBuddie={potentialBuddie}
      listOfUsersWithoutMe={listOfUsersWithoutMe}
    />
  );
}
