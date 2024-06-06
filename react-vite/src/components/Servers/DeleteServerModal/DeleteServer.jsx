import { clearCurrentServerThunk, deleteServerThunk } from "../../../redux/servers";
import { useModal } from "../../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DeleteServer.module.css";
import { clearChannelsThunk } from "../../../redux/channels";

const DeleteServer = () => {
  const server = useSelector((state) => state.server.current);
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const onClick = async () => {
    try {
      await dispatch(deleteServerThunk(server));
      dispatch(clearCurrentServerThunk())
      dispatch(clearChannelsThunk())
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
          >{`Are you sure you want to delete server: ${server?.name}?`}</h5>

          <button
            onClick={() => {
              onClick();
            }}
            className="shadow"
          >
            Yes (Delete Server)
          </button>
          <button
            className="shadow"
            onClick={() => {
              closeModal();
            }}
          >
            No (Keep Server)
          </button>
        </main>
    </>
  );
};

export default DeleteServer;
