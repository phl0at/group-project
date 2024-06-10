import { useState } from "react";
import { useModal } from "../../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DeleteServer.module.css";
import {
  getAllServersThunk,
  deleteServerThunk,
  setCurrentServerThunk,
} from "../../../redux/servers";
import {
  getAllChannelsThunk,
  setCurrentChannelThunk,
} from "../../../redux/channels";
import { getAllMessagesThunk } from "../../../redux/messages";

const DeleteServer = () => {
  const server = useSelector((state) => state.server.current);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const loadDefault = async () => {
    const allServers = await dispatch(getAllServersThunk());
    await dispatch(setCurrentServerThunk(allServers[0]));
    const allChannels = await dispatch(getAllChannelsThunk(allServers[0]));
    const currChannel = await dispatch(setCurrentChannelThunk(allChannels[0]));
    if (currChannel) {
      await dispatch(getAllMessagesThunk(currChannel));
    }
  };

  const onClick = async () => {
    try {
      await dispatch(deleteServerThunk(server));
      loadDefault();
      closeModal();
    } catch (e) {
      setErrors({ error: "An unexpected error occurred" });
    }
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles.title}>You are about to delete server:</div>
        <div className={styles.server_name}>{server.name}</div>
        <div className={styles.confirm}>Are you sure?</div>
        <div className={styles.error}>{errors.error && errors.error}</div>
        <div className={styles.buttons}>
          <button
            onClick={() => {
              onClick();
            }}
            className={styles.yes}
          >
            Yes
          </button>
          <button
            className={styles.no}
            onClick={() => {
              closeModal();
            }}
          >
            No
          </button>
        </div>
      </main>
    </>
  );
};

export default DeleteServer;
