import styles from "./Main.module.css";
import { useSelector } from "react-redux";
import { HiMiniCpuChip } from "react-icons/hi2";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../Auth/LoginFormModal";
import SignupFormModal from "../Auth/SignupFormModal";

function UserBar() {
  const channel = useSelector((state) => state.channel.current);
  const server = useSelector((state) => state.server.current);
  const user = useSelector((state) => state.session.user);
  return (
    <main className={styles.nav}>
      <div className={styles.hyper}>
        <p>HyperComm</p>
        <button className={styles.directImg}>
          <HiMiniCpuChip size={"100%"} />
        </button>

        {!user && (
          <div className={styles.login_signup}>
            <OpenModalButton
              buttonText="Log In"
              className={styles.login}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
              buttonText="Sign Up"
              className={styles.signup}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </div>
      {server && <div className={styles.server}>{server.name}</div>}
      {channel && <div className={styles.channel}>{channel.name}</div>}
    </main>
  );
}

export default UserBar;
