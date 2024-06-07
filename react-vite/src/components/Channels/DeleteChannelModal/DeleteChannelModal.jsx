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
  // const allChannels = useSelector(getChannelsArray)
  // cannot use this array to update currentChannel and allMessages on lines 39 & 40
  // the store and database are updated after the deleteThunk, but this array is not

  const handleDelete = async () => {
    setErrors({});
    try {
      // currently, the backend DB routes are doing 3 queries:
      // 1) get the Channel to be deleted, 2) get the Server it belongs to
      // if the Server is owned by the current user, delete the channel
      // after successful delete, 3) get all remaining channels and return them in array
      // if we can figure out the issue above then we can get rid of that last query

      // console.log('AFTER', allChannels)
      const response = await dispatch(deleteChannelThunk(channel, serverId));
      // console.log('BEFORE', allChannels)

      if (response) {
        dispatch(clearCurrentChannelThunk());
        dispatch(clearCurrentMessagesThunk());
        if (response.length > 0) {
          dispatch(setCurrentChannelThunk(response[0]));
          dispatch(getAllMessagesThunk(response[0]));
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
