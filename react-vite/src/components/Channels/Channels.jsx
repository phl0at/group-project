import { getAllChannelsThunk, getChannelsArray } from "../../redux/channels";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function ChannelsList() {
  return "NULL";
  const dispatch = useDispatch();
  const channels = useSelector(getChannelsArray);
  useEffect(() => {
    dispatch(getAllChannelsThunk(server));
  }, []);

  if (!channels.length) return "No channels in this server!";

  return (
    <>
      {channels.map((channel) => (
        <div key={channel.id}>
          <button>{channel.name}</button>
        </div>
      ))}
    </>
  );
}

export default ChannelsList;
