import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import {
  createChannelThunk,
  getAllChannelsThunk,
  setCurrentChannelThunk,
} from "../../../redux/channels";
import styles from "./CreateChannelModal.module.css";

const CreateChannelModal = ({ curRoom, setCurRoom, setPrevRoom }) => {
  const dispatch = useDispatch();
  const server = useSelector((state) => state.server.current);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!name.trim().length) {
      setErrors({ error: "Channel name is required" });
      return;
    }

    try {
      const response = await dispatch(
        createChannelThunk({
          server_id: server.id,
          name,
        })
      );

      if (response.errors) {
        setErrors(response.errors);
      } else {
        dispatch(getAllChannelsThunk(server));
        dispatch(setCurrentChannelThunk(response));
        setPrevRoom(curRoom);
        setCurRoom(response.id);
        closeModal();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Make a new channel!</div>
      <div className={styles.error}>{errors.error && errors.error}</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          placeholder="Enter a name..."
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className={styles.submit} type="submit">
          Create Channel
        </button>
      </form>
    </main>
  );
};

export default CreateChannelModal;
