import { useState } from "react";
import { useModal } from "../../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DeleteServer.module.css";
import { initialLoadThunk, deleteServerThunk } from "../../../redux/servers";

const DeleteServer = () => {
  const server = useSelector((state) => state.server.current);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const onClick = () => {
    try {
      dispatch(deleteServerThunk(server));
      dispatch(initialLoadThunk());
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
