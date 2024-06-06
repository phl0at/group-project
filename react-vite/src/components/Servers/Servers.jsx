import { useSelector, useDispatch } from "react-redux";
import { getServersArray, setCurrentServerThunk } from "../../redux/servers";
import {
  clearCurrentChannelThunk,
  getAllChannelsThunk,
} from "../../redux/channels";
import { clearCurrentMessagesThunk } from "../../redux/messages";
import styles from "./Servers.module.css";
import default_server from "../../../../images/default_server.jpg";

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
    <main className={styles.main}>
      <div className={styles.list}>
        {servers?.map((server) => {


          const src = server.image[0]?.img_url ? server.image[0].img_url : default_server

          return (<button
            className={styles.button}
            key={server.id}
            onClick={(e) => {
              e.preventDefault();
              handleServerClick(server);
            }}
          >
            <img className={styles.image} src={src} />
          </button>)
        })}
      </div>
    </main>
  );
}

export default ServersList;
