import { useSelector, useDispatch } from "react-redux";
import { getServersArray, setCurrentServerThunk } from "../../redux/servers";
import {
  clearCurrentChannelThunk,
  getAllChannelsThunk,
} from "../../redux/channels";
import { clearCurrentMessagesThunk } from "../../redux/messages";
import styles from "./Servers.module.css";

function ServersList() {
  const dispatch = useDispatch();
  const servers = useSelector(getServersArray);
  const channel = useSelector((state) => state.channel.current);

  const handleServerClick = (server) => {
    dispatch(getAllChannelsThunk(server));
    dispatch(setCurrentServerThunk(server));

    if (channel) {
      dispatch(clearCurrentMessagesThunk());
      dispatch(clearCurrentChannelThunk());
    }
  };

  return (
    <main className={styles.list}>
      {servers?.map((server) => (
        <button
          className={styles.button}
          key={server.id}
          onClick={(e) => {
            e.preventDefault();
            handleServerClick(server);
          }}
        >
          <img className={styles.image} src={server.image[0].img_url} />
        </button>
      ))}
    </main>
  );
}

export default ServersList;
