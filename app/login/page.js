import styles from './page.module.scss';

export default function Login() {
  return (
    <div className={styles.mainDiv}>
      <form>
        <label htmlFor="username">
          Username:
          <input htmlFor="username" />
        </label>
        <label htmlFor="password">
          Password:
          <input htmlFor="password" type="password" />
        </label>
      </form>
      <button>Register</button>
    </div>
  );
}
