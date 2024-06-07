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

const DeleteChannelModal = ({ allChannels, channel, serverId }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  // const allChannels = useSelector(getChannelsArray);

  const handleDelete = async () => {
    setErrors({});
    try {
      // current issue where the allChannels array from the custom selector
      // is not removing the deleted channel from its array, even though
      // the channel is removed from the db and the redux store

      console.log("BEFORE!!!!!!!!!!", allChannels);
      const response = await dispatch(deleteChannelThunk(channel, serverId));
      console.log("AFTER!!!!!!!!!!!", allChannels);

      if (response) {
        dispatch(clearCurrentChannelThunk());
        dispatch(clearCurrentMessagesThunk());
        if (allChannels.length > 0) {
          dispatch(setCurrentChannelThunk(allChannels[0]));
          dispatch(getAllMessagesThunk(allChannels[0]));
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
