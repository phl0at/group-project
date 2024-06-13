import styles from "./Main.module.css";
import { socket } from "../../socket";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../Auth/LoginFormModal";
import SignupFormModal from "../Auth/SignupFormModal";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearCurrentServerThunk, initialLoadThunk } from "../../redux/servers";
import { clearChannelsThunk } from "../../redux/channels";
import ServersList from "../Servers/Servers";
import ChannelsList from "../Channels/";
import MessagesList from "../Messages/";
import {
  clearCurrentMessagesThunk,
  getAllMessagesThunk,
} from "../../redux/messages";

function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    socket.on("message", (message) => {
      dispatch(getAllMessagesThunk(message.message["channel_id"]));
    });
  }, []);

  useEffect(() => {
    if (user) {
      socket.connect();
      dispatch(initialLoadThunk());
    } else {
      clearCurrentServerThunk();
      clearChannelsThunk();
      clearCurrentMessagesThunk();
    }
  }, [user]);

  return (
    <>
      {user ? (
        <>
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
