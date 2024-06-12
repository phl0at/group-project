import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllServersThunk, setCurrentServerThunk } from "../../redux/servers";
import {
  getAllChannelsThunk,
  setCurrentChannelThunk,
  setLastChannelThunk,
} from "../../redux/channels";
import ServersList from "../Servers/Servers";
import ChannelsList from "../Channels/";
import MessagesList from "../Messages/";
import styles from "./Main.module.css";
import { getAllMessagesThunk } from "../../redux/messages";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../Auth/LoginFormModal";
import SignupFormModal from "../Auth/SignupFormModal";
import { io } from "socket.io-client";

function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const socket = io("http://127.0.0.1:8000");
  const channel = useSelector(state => state.channel.current)

  useEffect(() => {
    if (user && !channel) {
      // loadDefault();
      socket.connect();
      socket.on("connect", () => {
        console.log("*****SOCKET CONNECTED*****");
      });
    }
  }, [user]);

  const loadDefault = async () => {
    const allServers = await dispatch(getAllServersThunk());
    await dispatch(setCurrentServerThunk(allServers[0]));
    const allChannels = await dispatch(getAllChannelsThunk(allServers[0]));
    const currChannel = await dispatch(setCurrentChannelThunk(allChannels[0]));
    if (currChannel) {
      await dispatch(setLastChannelThunk(currChannel));
      await dispatch(getAllMessagesThunk(currChannel));
    }
  };

  return (
    <>
      {user ? (
        <>
          <main className={styles.page}>
            <ServersList socket={socket} />
            <ChannelsList socket={socket} />
            <MessagesList socket={socket} />
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
