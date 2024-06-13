import { useModal } from "../../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DeleteMessageModal.module.css";
import {
  deleteMessageThunk,
  getAllMessagesThunk,
} from "../../../redux/messages";

const DeleteMessage = ({ message, socket }) => {
  const channel = useSelector((state) => state.channel.current);
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const onClick = async () => {
    try {
      await dispatch(deleteMessageThunk(message));
      socket.emit('message', {room: channel.id, message})
      dispatch(getAllMessagesThunk(channel));
      closeModal();
    } catch (e) {
      closeModal();
      return e;
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        Are you sure you want to delete your message?
      </div>
      <div className={styles.buttons}>
        <button
          className={styles.yes}
          onClick={() => {
            onClick();
          }}
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
  );
};

export default DeleteMessage;
