import { getChannelsArray, setCurrentChannelThunk } from "../../redux/channels";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesThunk } from "../../redux/messages";
import EditChannelModal from "../EditChannelModal ";
import DeleteChannelModal from "./DeleteChannelModal";
import EditServerModal from "../Servers/EditServerModal";
import { CiEdit } from "react-icons/ci";
import styles from "./Channels.module.css";

import CreateChannelModal from "../Channels/CreateChannelModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function ChannelsList() {
  const dispatch = useDispatch();
  const channels = useSelector(getChannelsArray);
  const server = useSelector((state) => state.server.current);
  const user = useSelector((state) => state.session.user);

  if (!server) return "";

  const handleChannelClick = async (channel) => {
    await dispatch(setCurrentChannelThunk(channel));
    await dispatch(getAllMessagesThunk(channel));
  };

  return (
    <>
      <div>
        <OpenModalButton
          buttonText={
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
                  {server.owner_id === user.id && (
                    <>
                      <OpenModalButton
                        buttonText={
                          <>
                            Edit
                            <CiEdit />
                          </>
                        }
                        modalComponent={<EditChannelModal channel={channel} />}
                      />
                      <OpenModalButton
                        buttonText={
                          <>
                            Delete
                            <CiEdit />
                          </>
                        }
                        modalComponent={
                          <DeleteChannelModal channel={channel} />
                        }
                      />
                    </>
                  )}
                </div>
              );
            }
          })}
      </div>
      <div>
        {server.owner_id === user.id && (
          <OpenModalButton
            buttonText={"Create Channel"}
            modalComponent={<CreateChannelModal serverId={server.id} />}
          />
        )}
      </div>
    </>
  );
}

export default ChannelsList;
