import { useModal } from "../../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DeleteMessageModal.module.css";
import {
  deleteMessageThunk,
  getAllMessagesThunk,
} from "../../../redux/messages";

const DeleteMessage = ({ message }) => {
  const channel = useSelector((state) => state.channel.current);
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const onClick = async () => {
    try {
      await dispatch(deleteMessageThunk(message));
      dispatch(getAllMessagesThunk(channel));
      closeModal();
    } catch (e) {
      closeModal();
      return e;
    }
  };

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.head}>Confirm Delete</h1>
        <h5
          className={styles.head}
        >{`Are you sure you want to delete this message?`}</h5>

        <button
          onClick={() => {
            onClick();
          }}
          className={styles.shadow}
        >
          Yes (Delete Message)
        </button>
        <button
          className={styles.shadow}
          onClick={() => {
            closeModal();
          }}
        >
          No (Keep Message)
        </button>
      </main>
    </>
  );
};

export default DeleteMessage;
