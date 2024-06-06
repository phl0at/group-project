import { useSelector, useDispatch } from "react-redux";
import { getServersArray, setCurrentServerThunk } from "../../redux/servers";
import {
  clearCurrentChannelThunk,
  getAllChannelsThunk,
} from "../../redux/channels";
import { clearCurrentMessagesThunk } from "../../redux/messages";
import styles from "./Servers.module.css";
import default_server from "../../../../images/default_server.jpg";
import DeleteServer from "../Servers/DeleteServerModal/DeleteServer";
import OpenModalMenuItem from "../Main/OpenModalMenuItem";

function ServersList() {
  const dispatch = useDispatch();
  const servers = useSelector(getServersArray);
  const channel = useSelector((state) => state.channel.current);
  const user = useSelector((state) => state.session.user);
  const curServer = useSelector((state) => state.server.current);
  const handleServerClick = (server) => {
    dispatch(getAllChannelsThunk(server));
    dispatch(setCurrentServerThunk(server));

    if (channel) {
      dispatch(clearCurrentMessagesThunk());
      dispatch(clearCurrentChannelThunk());
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.list}>
        {servers?.map((server) => (
          <button
            className={styles.button}
            key={server.id}
            onClick={(e) => {
              e.preventDefault();
              handleServerClick(server);
            }}
          >
            {server.image[0]?.img_url ? (
              <img className={styles.image} src={server.image[0].img_url} />
            ) : (
              <img className={styles.image} src={default_server} />
            )}
          </button>
        ))}
      </div>
      <div className={styles.delete}>
        {curServer && user.id === curServer.owner_id && (
          <OpenModalMenuItem
            itemText={`Delete Server`}
            modalComponent={<DeleteServer />}
          />
        )}
      </div>
    </main>
  );
}

export default ServersList;
