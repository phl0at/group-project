import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllServersThunk, setCurrentServerThunk } from "../../redux/servers";
import {
  getAllChannelsThunk,
  setCurrentChannelThunk,
} from "../../redux/channels";
import ServersList from "../Servers/Servers";
import ChannelsList from "../Channels/";
import MessagesList from "../Messages/";
import styles from "./Main.module.css";
import OpenModalButton from "../OpenModalButton";
import CreateChannelModal from "../Channels/CreateChannelModal";
import UserBar from "./UserBar";
import { getAllMessagesThunk } from "../../redux/messages";

function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const server = useSelector((state) => state.server.current);

  const loadDefault = async () => {
    const allServers = await dispatch(getAllServersThunk());
    const currServer = await dispatch(setCurrentServerThunk(allServers[0]));
    const allChannels = await dispatch(getAllChannelsThunk(currServer));
    const currChannel = await dispatch(setCurrentChannelThunk(allChannels[0]));
    if (currChannel) {
      await dispatch(getAllMessagesThunk(currChannel));
    }
  };

  useEffect(() => {
    loadDefault();
  }, []);

  return (
    <>
      {user ? (
        <>
          <div className={styles.header}>
            <UserBar />
          </div>
          <main className={styles.page}>
            <ServersList />
            <ChannelsList />
            <MessagesList />
          </main>
        </>
      ) : (
        <div className={styles.header}>
          <UserBar />
        </div>
      )}
    </>
  );
}

export default MainComponent;
