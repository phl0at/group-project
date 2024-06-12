import { useState } from "react";
import { thunkLogin } from "../../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import styles from "./LoginForm.module.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
      console.log(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Please Login</div>
      <form name="login" className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.email}
          type="text"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className={styles.errors}>{errors.email && errors.email}</div>
        <input
          className={styles.password}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className={styles.errors}>
          {errors.password && errors.password}
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={closeModal}>
            Cancel
          </button>
          <button className={styles.login} type="submit">
            Log In
          </button>
        </div>
      </form>
    </main>
  );
}

export default LoginFormModal;
