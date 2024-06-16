import styles from "./Main.module.css";
import { socket } from "../../socket";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../Auth/LoginFormModal";
import SignupFormModal from "../Auth/SignupFormModal";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { initialLoadThunk } from "../../redux/servers";
import ServersList from "../Servers/Servers";
import ChannelsList from "../Channels/";
import MessagesList from "../Messages/";
import { socketDelete, socketCreate } from "../../redux/messages";

function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [curRoom, setCurRoom] = useState(1);
  const [prevRoom, setPrevRoom] = useState(1);

  useEffect(() => {
    if (user) {
      dispatch(initialLoadThunk());
      socket.connect();
    }
  }, [user]);

  useEffect(() => {
    socket.on("message", (message) => {
      dispatch(socketCreate(message));
    });
    socket.on("delete", (message) => {
      dispatch(socketDelete(message));
    });
  }, []);

  return (
    <>
      {user ? (
        <>
          <main className={styles.page}>
            <ServersList
              curRoom={curRoom}
              setCurRoom={setCurRoom}
              setPrevRoom={setPrevRoom}
            />
            <ChannelsList
              curRoom={curRoom}
              setCurRoom={setCurRoom}
              setPrevRoom={setPrevRoom}
            />
            <MessagesList curRoom={curRoom} prevRoom={prevRoom} />
          </main>
        </>
      ) : (
        <main className={styles.greeting}>
          <div className={styles.left}>
            <div className={styles.welcome}>welcome to</div>
            <div className={styles.title}>hYpercomm</div>
          </div>
          <div className={styles.right}>
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
        </main>
      )}
    </>
  );
}

export default MainComponent;
