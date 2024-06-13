import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import {
  clearCurrentChannelThunk,
  deleteChannelThunk,
} from "../../../redux/channels";
import { clearCurrentMessagesThunk } from "../../../redux/messages";
import styles from "./DeleteChannelModal.module.css";

const DeleteChannelModal = ({ channel, serverId }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleDelete = async () => {
    setErrors({});
    try {
      await dispatch(clearCurrentChannelThunk());
      await dispatch(clearCurrentMessagesThunk());
      await dispatch(deleteChannelThunk(channel, serverId));
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
