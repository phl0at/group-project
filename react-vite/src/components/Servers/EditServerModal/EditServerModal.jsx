import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { updateServerThunk } from "../../../redux/servers";
import styles from "./EditServerModal.module.css";


const EditServerModal = () => {
  const server = useSelector((state) => state.server.current);
  const dispatch = useDispatch();
  // const sessionUser = useSelector((state) => state.session.user);
  const [serverName, setServerName] = useState(server.name);
  const [errors, setErrors] = useState("");
  const [file, setFile] = useState(null);
  const { closeModal } = useModal();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (errors.length) {
      setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors("");

    try {
      if (!serverName.trim().length) {
        setErrors("Server Name is required");
      }
      if (!file) {
        return setErrors("Please select a file.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("serverName", serverName);

      dispatch(updateServerThunk(server.id, formData));
      closeModal();

    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Edit Server</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          required
        />
        <div>
          <input type="file" onChange={handleFileChange} />
          <p>{errors && { errors }}</p>
        </div>
        <button className={styles.submit} type="submit">
          Update Server
        </button>
      </form>
    </main>
  );
};

export default EditServerModal;
