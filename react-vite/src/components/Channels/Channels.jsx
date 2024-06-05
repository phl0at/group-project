import { getChannelsArray, setCurrentChannelThunk } from "../../redux/channels";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesThunk } from "../../redux/messages";
import OpenModalMenuItem from "../Main/OpenModalMenuItem";
import EditChannelModel from "../EditChannelModal ";
import { CiEdit } from "react-icons/ci";

function ChannelsList() {
  const dispatch = useDispatch();
  const channels = useSelector(getChannelsArray);
  const server = useSelector((state) => state.server.current);

  if (!server) return ""
  if (!channels.length) return "No channels in this server!";

  const handleChannelClick = (channel) =>{
    dispatch(setCurrentChannelThunk(channel))
    dispatch(getAllMessagesThunk(channel))
  }

  return (
    <>
      {server &&
        channels.map((channel) => (
          <div key={channel.id}>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleChannelClick(channel);
              }}
            >
              {channel.name}
            </button>
          </div>
        ))}
    </>
  );
}

export default ChannelsList;
