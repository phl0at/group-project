import { useDispatch, useSelector } from "react-redux";
import { getServersArray, setCurrentServerThunk } from "../../redux/servers";
import styles from "./Servers.module.css";
import default_server from "../../../../images/default_server.jpg";
import {
  getAllChannelsThunk,
  setCurrentChannelThunk,
} from "../../redux/channels";
import {
  clearCurrentMessagesThunk,
  getAllMessagesThunk,
} from "../../redux/messages";

function ServersList() {
  const dispatch = useDispatch();
  const servers = useSelector(getServersArray);

  const handleServerClick = async (server) => {
    await dispatch(setCurrentServerThunk(server));
    const allChannels = await dispatch(getAllChannelsThunk(server));
    const channel = await dispatch(setCurrentChannelThunk(allChannels[0]));
    if (channel) {
      await dispatch(getAllMessagesThunk(channel));
    } else {
      dispatch(clearCurrentMessagesThunk());
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.list}>
        {servers.map((server) => {
          const src = server.image[0]?.img_url
            ? server.image[0]?.img_url
            : default_server;

          return (
            <button
              className={styles.button}
              key={server.id}
              onClick={(e) => {
                e.preventDefault();
                handleServerClick(server);
              }}
            >
              <img className={styles.image} src={src} />
            </button>
          );
        })}
      </div>
    </main>
  );
}

export default ServersList;
