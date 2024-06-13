import { useModal } from "../../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DeleteMessageModal.module.css";
import {
  deleteMessageThunk,
} from "../../../redux/messages";
import { socket } from "../../../socket";

const DeleteMessage = ({ message, curRoom }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const onClick = () => {
    try {
      dispatch(deleteMessageThunk(message));
      socket.emit("message", { room: curRoom, message });
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
