import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { thunkSignup } from "../../../redux/session";
import styles from "./SignupForm.module.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Sign Up</div>
      <form className={styles.form} onSubmit={handleSubmit}>
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
          className={styles.user_name}
          type="text"
          placeholder="Enter a user name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className={styles.errors}>
          {errors.username && errors.username}
        </div>
        <input
          className={styles.password}
          type="password"
          placeholder="Enter a secure password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className={styles.errors}>
          {errors.password && errors.password}
        </div>
        <input
          className={styles.confirm_password}
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className={styles.errors}>
          {errors.confirmPassword && errors.confirmPassword}
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={closeModal}>
            Cancel
          </button>
          <button className={styles.submit} type="submit">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default SignupFormModal;
