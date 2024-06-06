import { getChannelsArray, setCurrentChannelThunk } from "../../redux/channels";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesThunk } from "../../redux/messages";
import OpenModalMenuItem from "../Main/OpenModalMenuItem";
import EditChannelModel from "../EditChannelModal ";
import CreateChannelModal from "../Channels/CreateChannelModal"
import { CiEdit } from "react-icons/ci";

function ChannelsList() {
  const dispatch = useDispatch();
  const channels = useSelector(getChannelsArray);
  const server = useSelector((state) => state.server.current);


  if (!server) return "";
  if (!channels.length) return "No channels in this server!";

  const handleChannelClick = (channel) => {
    dispatch(setCurrentChannelThunk(channel));
    dispatch(getAllMessagesThunk(channel));
  };

  return (
    <>
      <div>
        <OpenModalMenuItem
          itemText={
            <>
              Create Channel: <CiEdit />
            </>
          }
          modalComponent={<CreateChannelModal serverId={server.id} />}
        />
      </div>
      <div>
        {server &&
          channels.map((channel) => {
            if (channel.server_id === server.id) {
              return (
                <div key={channel.id}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleChannelClick(channel);
                    }}
                  >
                    {channel.name}
                  </button>
                  <OpenModalMenuItem
                    itemText={<CiEdit />}
                    modalComponent={<EditChannelModel channel={channel} />}
                  />
                </div>
              );
            }
          })}
      </div>

    </>
  );
}

export default ChannelsList;
