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
import UserBar from "./UserBar";
import { getAllMessagesThunk } from "../../redux/messages";

function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

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
    if (user) {
      loadDefault();
    }
  }, [user]);

  return (
    <>
      <UserBar />
      {user ? (
        <main className={styles.page}>
          <ServersList />
          <ChannelsList />
          <MessagesList />
        </main>
      ) : (
        // only here so there isn't blank whitespace below the UserBar when
        // nobody is signed in. can change to a welcome page at some point
        <main className={styles.page}></main>
      )}
    </>
  );
}

export default MainComponent;
