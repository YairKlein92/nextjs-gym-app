import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.mainDiv}>
      <a href="/register">Register</a>
      <a href="/login">Login</a>
    </div>
  );
}
