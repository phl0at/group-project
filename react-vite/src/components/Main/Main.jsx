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
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../Auth/LoginFormModal";
import SignupFormModal from "../Auth/SignupFormModal";

function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  const loadDefault = async () => {
    const allServers = await dispatch(getAllServersThunk());
    await dispatch(setCurrentServerThunk(allServers[0]));
    const allChannels = await dispatch(getAllChannelsThunk(allServers[0]));
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
      {user ? (
        <>
          <UserBar />
          <main className={styles.page}>
            <ServersList />
            <ChannelsList />
            <MessagesList />
          </main>
        </>
      ) : (
        <main className={styles.greeting}>
          <div className={styles.login_signup}>
            <div className={styles.title}>Welcome to HyperComm!</div>
            <div className={styles.buttons}>
              <OpenModalButton
                buttonText="Log In"
                className={styles.login}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalButton
                buttonText="Sign Up"
                className={styles.signup}
                modalComponent={<SignupFormModal />}
              />
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default MainComponent;
