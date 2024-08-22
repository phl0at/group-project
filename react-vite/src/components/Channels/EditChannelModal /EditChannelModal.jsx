import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import {
  setCurrentChannelThunk,
  updateChannelThunk,
} from "../../../redux/channels";
import styles from "./EditChannelModal.module.css";

const EditChannelModel = ({ channel }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(channel.name);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    if (errors.length) {
      setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!name.trim().length) {
      setErrors({ error: "Channel name is required" });
    }

    try {
      const success = await dispatch(
        updateChannelThunk({
          id: channel.id,
          name: name,
        })
      );

      if (success) {
        dispatch(setCurrentChannelThunk(success));
        closeModal();
      } else {
        setErrors({ error: "Failed to update channel" });
      }
    } catch (error) {
      setErrors({ error: "An unexpected error occurred" });
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Rename Channel</div>
      <div className={styles.error}>{errors.error && errors.error}</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className={styles.submit} type="submit">
          Update Channel
        </button>
      </form>
    </main>
  );
};

export default EditChannelModel;
