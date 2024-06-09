import styles from "./Main.module.css";
import { useSelector } from "react-redux";
import { HiMiniCpuChip } from "react-icons/hi2";

import ServerMenu from "./ServerMenu";

function UserBar() {
  const channel = useSelector((state) => state.channel.current);
  const server = useSelector((state) => state.server.current);
  const user = useSelector((state) => state.session.user);
  return (
    <main className={styles.nav}>
      <div className={styles.hyper}>
        <button className={styles.directImg}>
          <HiMiniCpuChip size={"75%"} />
        </button>
      </div>
      {server && (
        <div className={styles.server}>
          <div className={styles.servername}>{server.name}</div>
          {server.owner_id === user.id && <ServerMenu />}
        </div>
      )}
      {channel && <div className={styles.channel}>{channel.name}</div>}
    </main>
  );
}

export default UserBar;
