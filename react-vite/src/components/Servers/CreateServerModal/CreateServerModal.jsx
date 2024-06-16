import styles from "./CreateServerModal.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { createServerThunk } from "../../../redux/servers";
import { useEffect } from "react";

const CreateServerModal = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [serverName, setServerName] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    try {
      if (!serverName.trim().length) {
        return setErrors({ errors: "Server Name is required" });
      }

      if (!file) {
        return setErrors({ errors: "Please select a file." });
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("serverName", serverName);
      formData.append("ownerId", sessionUser.id);

      dispatch(createServerThunk(formData));
      closeModal();
    } catch (e) {
      setErrors(e.message || "An unexpected error occurred");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Make a new server!</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.error}>{errors && errors.errors}</p>
        <input
          className={styles.input}
          placeholder="Enter a name..."
          type="text"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          required
        />
        <div>
          <input
            className={styles.input}
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <button className={styles.submit} type="submit">
          Create
        </button>
      </form>
    </main>
  );
};

export default CreateServerModal;
