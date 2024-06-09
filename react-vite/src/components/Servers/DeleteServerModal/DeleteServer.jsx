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
