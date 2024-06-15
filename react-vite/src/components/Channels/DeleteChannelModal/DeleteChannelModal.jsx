import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import {
  deleteChannelThunk,
  setCurrentChannelThunk,
} from "../../../redux/channels";
import styles from "./DeleteChannelModal.module.css";
import { getAllMessagesThunk } from "../../../redux/messages";

const DeleteChannelModal = ({ channel, server, setCurRoom, setPrevRoom }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleDelete = () => {
    setErrors({});
    try {
      dispatch(deleteChannelThunk(channel, server.id));
      dispatch(setCurrentChannelThunk(server.channels[0]));
      dispatch(getAllMessagesThunk(server.channels[0].id))
      setPrevRoom(channel.id)
      setCurRoom(server.channels[0].id);
      closeModal();
    } catch (e) {
      setErrors({ error: "An unexpected error occurred" });
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>You are about to delete channel:</div>
      <div className={styles.channel_name}>{channel.name}</div>
      <div className={styles.confirm}>Are you sure?</div>
      <div className={styles.error}>{errors.error && errors.error}</div>
      <div className={styles.buttons}>
        <button className={styles.yes} onClick={handleDelete}>
          Yes
        </button>
        <button className={styles.no} onClick={closeModal}>
          No
        </button>
      </div>
    </main>
  );
};

export default DeleteChannelModal;
