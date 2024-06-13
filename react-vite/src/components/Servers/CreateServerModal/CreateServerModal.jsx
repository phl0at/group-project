import styles from "./CreateServerModal.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import {
  createServerThunk,
} from "../../../redux/servers";
import { useEffect } from "react";

const CreateServerModal = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [serverName, setServerName] = useState("");
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const { closeModal } = useModal();

  useEffect(() => {
    if (errors.length) {
      setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData();
    formData.append("serverName", serverName);
    formData.append("ownerId", sessionUser.id);
    if (image) formData.append("file", image);

    try {
      if (!serverName.trim().length) {
        setErrors({ error: "Server Name is required" });
      } else {
        // this will need to be changed when the
        // image upload feature is
        // integrated with AWS below
        await dispatch(
          createServerThunk({
            serverName,
            ownerId: sessionUser.id,
            image_url: null,
          })
        );
        closeModal();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Make a new server!</div>
      <div className={styles.error}>{errors.error && errors.error}</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          placeholder="Enter a name..."
          type="text"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          required
        />
        {/*
          create ServerProfileImageUpload by copy/pasting UserProfileImageUpload component
          import that component into this file and render it here

          <ServerProfileImageUpload />

        */}
        <button className={styles.submit} type="submit">
          Create
        </button>
      </form>
    </main>
  );
};

export default CreateServerModal;
