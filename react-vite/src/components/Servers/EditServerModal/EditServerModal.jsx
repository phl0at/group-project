import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateServerThunk } from "../../../redux/servers";
import styles from "./EditServerModal.module.css";

const EditServerModal = () => {
  const server = useSelector((state) => state.server.current);
  const dispatch = useDispatch();
  const [serverName, setServerName] = useState(server.name);
  const [errors, setErrors] = useState("");
  const [file, setFile] = useState(null);


  const handleFileChange = (e) => {
    setErrors("");
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (errors.length) {
      setErrors(errors);
    }
  }, [errors]);

  const submitName = (e) => {
    e.preventDefault();
    setErrors("");

    if (!serverName.trim().length) {
      return setErrors({ errors: "Server Name is required" });
    } else {
      try {
        const formData = new FormData();
        formData.append("serverName", serverName);
        dispatch(updateServerThunk(server.id, formData));
        setErrors({ errors: "Server name updated successfully!" });
      } catch (error) {
        console.log(error);
        setErrors({ errors: error });
      }
    }
  };
  const submitImage = (e) => {
    e.preventDefault();
    setErrors("");

    if (!file) return setErrors({ errors: "Please select a file." });

    const allowedExtensions = ["png", "jpg", "jpeg", "gif", "pdf"];
    const fileName = file.name;
    const imgExt = fileName.split(".").pop();
    const checkExt = () => allowedExtensions.includes(imgExt.toLowerCase());

    if (!checkExt()) {
      return setErrors({ errors: "File extension not supported." });
    } else {
      try {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(updateServerThunk(server.id, formData));
        setErrors({ errors: "Server Image updated successfully!" });
      } catch (error) {
        console.log(error);
        setErrors({ errors: error });
      }
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Edit Server</div>
      <div className={styles.form}>
        <form className={styles.name_form} onSubmit={submitName}>
          <p className={styles.error}>{errors && errors.errors}</p>
          <input
            className={styles.input}
            type="text"
            value={serverName}
            onChange={(e) => {
              setErrors("");
              setServerName(e.target.value);
            }}
            required
          />
          <button className={styles.submit} type="submit">
            Update Name
          </button>
        </form>
        <form onSubmit={submitImage} className={styles.image_form}>
          <input
            className={styles.input}
            type="file"
            onChange={handleFileChange}
          />
          <button className={styles.submit} type="submit">
            Update Image
          </button>
        </form>
      </div>
    </main>
  );
};

export default EditServerModal;
