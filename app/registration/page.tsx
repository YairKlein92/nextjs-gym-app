import styles from './page.module.scss';

export default function Registration() {
  return (
    <div className={styles.mainDiv}>
      <form>
        <label htmlFor="username">
          Username:
          <input />
        </label>
        <label htmlFor="password">
          Password:
          <input type="password" />
        </label>
        <label htmlFor="mail">
          Mail:
          <input />
        </label>
        <label htmlFor="mobile">
          Phone number:
          <input />
        </label>
        <label htmlFor="shredding">
          Are you shredding?
          <input type="checkbox" />
        </label>
        <label htmlFor="bulking">
          Are you bulking?
          <input type="checkbox" />
        </label>
        <label htmlFor="experienced">
          Are you experienced?
          <input type="checkbox" />
        </label>
      </form>
      <button>Register</button>
    </div>
  );
}
