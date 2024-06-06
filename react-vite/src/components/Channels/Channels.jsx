import { getChannelsArray, setCurrentChannelThunk } from "../../redux/channels";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesThunk } from "../../redux/messages";
import EditChannelModal from "../EditChannelModal ";
import DeleteChannelModal from "./DeleteChannelModal";
import EditServerModal from "../Servers/EditServerModal";
import { CiEdit } from "react-icons/ci";
import { HiBan } from "react-icons/hi";
import styles from "./Channels.module.css";
import CreateChannelModal from "../Channels/CreateChannelModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteServer from "../Servers/DeleteServerModal/DeleteServer";
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
    <main className={styles.main}>
      <h3 className={styles.server}>{server.name}</h3>
      <div className={styles.serverEdit}>
        <div className={styles.delete}>
          {server && user.id === server.owner_id && (
            <OpenModalButton
              buttonText={<HiBan />}
              modalComponent={<DeleteServer />}
            />
          )}
        </div>
        <OpenModalButton
          title="Rename Server"
          buttonText={<CiEdit />}
          modalComponent={<EditServerModal server={server} />}
        />
      </div>
      <div className={styles.list}>
        {server &&
          channels.map((channel) => {
            if (channel.server_id === server.id) {
              return (
                <div className={styles.channel} key={channel.id}>
                  <button
                    className={styles.name}
                    onClick={(e) => {
                      e.preventDefault();
                      handleChannelClick(channel);
                    }}
                  >
                    {channel.name}
                  </button>

                  {server.owner_id === user.id && (
                    <div className={styles.buttons}>
                      <OpenModalButton
                        title="Delete Channel"
                        buttonText={<HiBan />}
                        modalComponent={
                          <DeleteChannelModal channel={channel} />
                        }
                      />
                      <OpenModalButton
                        title="Rename Channel"
                        buttonText={<CiEdit />}
                        modalComponent={<EditChannelModal channel={channel} />}
                      />
                    </div>
                  )}
                </div>
              );
            }
          })}
      </div>
        {server.owner_id === user.id && (
          <div className={styles.create}>
            <OpenModalButton
              buttonText={"Create Channel"}
              modalComponent={<CreateChannelModal serverId={server.id} />}
            />
          </div>
        )}
    </main>
  );
}

export default ChannelsList;
