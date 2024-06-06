import { getChannelsArray, setCurrentChannelThunk } from "../../redux/channels";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesThunk } from "../../redux/messages";
import OpenModalMenuItem from "../Main/OpenModalMenuItem";
import EditChannelModal from "../EditChannelModal ";
import CreateChannelModal from "./CreateChannelModal";
import DeleteChannelModal from "./DeleteChannelModal";
import EditServerModal from "../Servers/EditServerModal";
import { CiEdit } from "react-icons/ci";
import "./Channels.module.css";

function ChannelsList() {
  const dispatch = useDispatch();
  const channels = useSelector(getChannelsArray);
  const server = useSelector((state) => state.server.current);
  const sessionUser = useSelector((state) => state.session.user);

  if (!server) return "";
  if (!channels.length) return "No channels in this server!";

  const handleChannelClick = async (channel) => {
    await dispatch(setCurrentChannelThunk(channel));
    await dispatch(getAllMessagesThunk(channel));
  };

  return (
    <>
      <div>
        <OpenModalMenuItem
          itemText={
            <>
              <h1>
                {server.name} Edit
                <CiEdit />
              </h1>
            </>
          }
          modalComponent={<EditServerModal server={server} />}
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
                  {server.owner_id === sessionUser.id && (
                    <>
                      <OpenModalMenuItem
                        itemText={
                          <>
                            Edit<CiEdit />
                          </>
                        }
                        modalComponent={<EditChannelModal channel={channel} />}
                      />
                      <OpenModalMenuItem
                        itemText={
                          <>
                            Delete<CiEdit />
                          </>
                        }
                        modalComponent={<DeleteChannelModal channel={channel} />}
                      />
                    </>
                  )}
                </div>
              );
            }
          })}
      </div>
      <div>
        {server.owner_id === sessionUser.id && (
          <OpenModalMenuItem
            itemText={<button>Create Channel</button>}
            modalComponent={<CreateChannelModal serverId={server.id} />}
          />
        )}
      </div>
    </>
  );
}

export default ChannelsList;
