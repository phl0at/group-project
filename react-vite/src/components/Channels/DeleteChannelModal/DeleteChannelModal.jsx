import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import {
  clearCurrentChannelThunk,
  deleteChannelThunk,
  getChannelsArray,
  setCurrentChannelThunk,
} from "../../../redux/channels";
import {
  clearCurrentMessagesThunk,
  getAllMessagesThunk,
} from "../../../redux/messages";

const DeleteChannelModal = ({ channel, serverId }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  const handleDelete = async () => {
    setErrors({});
    try {

      const remainingChannels = await dispatch(deleteChannelThunk(channel, serverId));

      if (!remainingChannels.errors) {
        dispatch(clearCurrentChannelThunk());
        dispatch(clearCurrentMessagesThunk());

        if (remainingChannels.length > 0) {
          dispatch(setCurrentChannelThunk(remainingChannels[0]));
          dispatch(getAllMessagesThunk(remainingChannels[0]));
        }
        closeModal();
      } else {
        setErrors({ error: "Failed to delete the channel" });
      }
    } catch (error) {
      setErrors({ error: "An unexpected error occurred" });
    }
  };

  return (
    <>
      <h1>Are you sure you want to delete {channel.name} channel?</h1>
      {errors.error && <p style={{ color: "red" }}>{errors.error}</p>}
      <div>
        <button onClick={handleDelete}>Yes</button>
        <button onClick={closeModal}>No</button>
      </div>
    </>
  );
};

export default DeleteChannelModal;
