import RegisterForm from './RegisterForm';

type Props = { searchParams: { returnTo?: string | string[] } };
export default function RegistrationPage(props: Props) {
  return <RegisterForm returnTo={props.searchParams.returnTo} />;
}
