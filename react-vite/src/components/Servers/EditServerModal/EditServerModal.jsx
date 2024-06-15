import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { updateServerThunk } from "../../../redux/servers";
import styles from "./EditServerModal.module.css";
import ServerImageUpload from "../ServerImageUpload";

const EditServerModal = () => {
  const server = useSelector((state) => state.server.current);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [serverName, setServerName] = useState(server.name);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const { closeModal } = useModal();

  useEffect(() => {
    if (errors.length) {
      setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData();
    formData.append("name", serverName);
    if (image) formData.append("file", image);

    try {
      if (!serverName.trim().length) {
        setErrors({ error: "Server Name is required" });
      } else {
        dispatch(
          updateServerThunk({
            id: server.id,
            formData,
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
      <div className={styles.title}>Rename Server</div>
      <div className={styles.error}>{errors.error && errors.error}</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          required
        />
        <ServerImageUpload setImage={setImage} />
        <button className={styles.submit} type="submit">
          Update Server
        </button>
      </form>
    </main>
  );
};

export default EditServerModal;
