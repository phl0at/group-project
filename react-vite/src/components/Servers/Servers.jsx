import default_server from "../../../../images/default_server.jpg";
import { getServersArray, setCurrentServerThunk } from "../../redux/servers";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Servers.module.css";
import {
  getAllChannelsThunk,
  setCurrentChannelThunk,
} from "../../redux/channels";
import { getAllMessagesThunk } from "../../redux/messages";
import CreateServerModal from "../Servers/CreateServerModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { FcElectricalSensor } from "react-icons/fc";
import { getAllReactionsThunk } from "../../redux/reactions";

function ServersList({ curRoom, setCurRoom, setPrevRoom }) {
  const dispatch = useDispatch();
  const servers = useSelector(getServersArray);
  const currServer = useSelector((state) => state.server.current);

  const handleServerClick = (server) => {
    setPrevRoom(curRoom);
    setCurRoom(server.channels[0]?.id);
    dispatch(setCurrentServerThunk(server));
    dispatch(getAllChannelsThunk(server));
    dispatch(setCurrentChannelThunk(server.channels[0]));
    dispatch(getAllMessagesThunk(server.channels[0]?.id));
    dispatch(getAllReactionsThunk(server.channels[0]?.id));
  };

  return (
    <main className={styles.main}>
      <div className={styles.hyper}>
        <button className={styles.direct_button}>
          <FcElectricalSensor size={"60"}/>
        </button>
      </div>
      <div className={styles.list}>
        {servers.map((server) => {
          const src = server.image_url ? server.image_url : default_server;
          return (
            <button
              title={server.name}
              className={`${styles.button} ${currServer.id === server.id && styles.selected
                }`}
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
