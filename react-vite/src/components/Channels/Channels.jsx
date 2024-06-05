import { getAllChannelsThunk, getChannelsArray } from "../../redux/channels";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalMenuItem from "../Main/OpenModalMenuItem";
import EditChannelModel from "../EditChannelModal ";
import { CiEdit } from "react-icons/ci";

function AllChannels({ server }) {
  const dispatch = useDispatch();
  const channels = useSelector(getChannelsArray);
  useEffect(() => {
    dispatch(getAllChannelsThunk(server));
  }, [dispatch, server]);

  if (!channels) return "Loading...";

  return (
    <ul>
      {channels.map((channel) => (
        <li key={channel.id}>
          <button>{channel.name}</button>
          <OpenModalMenuItem
            itemText={<CiEdit />} 
            modalComponent={<EditChannelModel channel={channel} />}
          />
        </li>
      ))}
    </ul>
  );
}

export default AllChannels;
