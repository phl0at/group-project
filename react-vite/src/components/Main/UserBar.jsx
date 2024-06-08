import styles from "./Main.module.css";
import { useSelector } from "react-redux";
import { HiMiniCpuChip } from "react-icons/hi2";

function UserBar() {
  const channel = useSelector((state) => state.channel.current);
  const server = useSelector((state) => state.server.current);

  return (
    <div className={styles.nav}>
      <button className={styles.directImg}>
        <HiMiniCpuChip size={55} />
      </button>
      {server && <h3 className={styles.server}>{server.name}</h3>}
      {channel && <h2 className={styles.channel}>{channel.name}</h2>}
    </div>
  );
}

export default UserBar;
