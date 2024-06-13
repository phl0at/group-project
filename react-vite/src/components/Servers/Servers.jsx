import default_server from "../../../../images/default_server.jpg";
import { getServersArray, setCurrentServerThunk } from "../../redux/servers";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Servers.module.css";
import {
  getAllChannelsThunk,
  setCurrentChannelThunk,
  setLastChannelThunk,
} from "../../redux/channels";
import { getAllMessagesThunk } from "../../redux/messages";
import CreateServerModal from "../Servers/CreateServerModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { HiMiniCpuChip } from "react-icons/hi2";

function ServersList() {
  const dispatch = useDispatch();
  const servers = useSelector(getServersArray);
  const channel = useSelector((state) => state.channel.current);

  const handleServerClick = (server) => {
    dispatch(setLastChannelThunk(channel))
    dispatch(setCurrentServerThunk(server));
    dispatch(getAllChannelsThunk(server));
    dispatch(setCurrentChannelThunk(server.channels[0]));
    dispatch(getAllMessagesThunk(server.channels[0].id));
  };

  return (
    <main className={styles.main}>
      <div className={styles.hyper}>
        <button className={styles.directImg}>
          <HiMiniCpuChip size={"75%"} />
        </button>
      </div>
      <div className={styles.list}>
        {servers.map((server) => {
          const src = server.image_url ? server.image_url : default_server;
          return (
            <button
              title={server.name}
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
        <div className={styles.create}>
          <OpenModalButton
            title="Create a server!"
            buttonText={<HiMiniPlusCircle size={"65%"} />}
            modalComponent={<CreateServerModal />}
          />
        </div>
      </div>
    </main>
  );
}

export default ServersList;
