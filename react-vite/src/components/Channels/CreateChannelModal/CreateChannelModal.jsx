import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { createChannelThunk, setCurrentChannelThunk } from "../../../redux/channels";

const CreateChannelModal = () => {
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
        dispatch(setCurrentChannelThunk(response))
        closeModal();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1>Create Channel</h1>
      {errors.error && <p>{errors.error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Channel Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create Channel</button>
      </form>
    </>
  );
};

export default CreateChannelModal;
