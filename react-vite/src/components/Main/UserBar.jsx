import styles from "./Main.module.css";
import { useSelector } from "react-redux";
import { HiMiniCpuChip } from "react-icons/hi2";
import ProfileButton from "./ProfileButton";

function UserBar() {
  const channel = useSelector((state) => state.channel.current);
  const server = useSelector((state) => state.server.current);
  const user = useSelector((state) => state.session.user);
  return (
    <div className={styles.nav}>
      <button className={styles.directImg}>
        <HiMiniCpuChip size={55} />
      </button>
      {!user && (
        <main className={styles.profileBar}>
          <ProfileButton className={styles.profile} />
        </main>
      )}
      {server && <h3 className={styles.server}>{server.name}</h3>}
      {channel && <h2 className={styles.channel}>{channel.name}</h2>}
    </div>
  );
}

export default UserBar;
