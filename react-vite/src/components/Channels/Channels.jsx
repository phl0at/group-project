import { HiOutlineDocumentText } from "react-icons/hi2";
import { HiOutlineTrash } from "react-icons/hi2";
import { getChannelsArray, setCurrentChannelThunk } from "../../redux/channels";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesThunk } from "../../redux/messages";
import EditChannelModal from "./EditChannelModal ";
import DeleteChannelModal from "./DeleteChannelModal";
import styles from "./Channels.module.css";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import OptionsMenu from "./OptionsMenu";
import default_user from "../../../../images/default_user.jpg";
import ServerMenu from "./ServerMenu";
import UserProfile from "../UserProfileImage/UserProfile";
import { getAllReactionsThunk } from "../../redux/reactions";

function ChannelsList({ curRoom, setCurRoom, setPrevRoom }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const server = useSelector((state) => state.server.current);
  const allChannels = useSelector(getChannelsArray);
  const currChannel = useSelector((state) => state.channel.current);

  const handleChannelClick = (channel) => {
    setPrevRoom(curRoom);
    setCurRoom(channel.id);
    dispatch(setCurrentChannelThunk(channel));
    dispatch(getAllMessagesThunk(channel.id));
    dispatch(getAllReactionsThunk(channel.id));
  };

  return (
    <main className={styles.main}>
      <div className={styles.list}>
        {server && (
          <div className={styles.server}>
            <div className={styles.server_name}>{server.name}</div>
            {server.owner_id === user.id && (
              <ServerMenu
                curRoom={curRoom}
                setCurRoom={setCurRoom}
                setPrevRoom={setPrevRoom}
              />
            )}
          </div>
        )}
        <div className={styles.channel_list}>
          {server &&
            allChannels.map((channel) => {
              const selected = currChannel?.id === channel.id ? true : false;
              if (channel.server_id === server.id) {
                return (
                  <div
                    className={
                      selected ? styles.selected_channel : styles.channel
                    }
                    key={channel.id}
                  >
                    <button
                      className={styles.channel_name}
                      onClick={(e) => {
                        e.preventDefault();
                        handleChannelClick(channel);
                      }}
                    >
                      # {channel.name}
                    </button>

                    <div className={styles.channel_buttons}>
                      {server.owner_id === user.id && (
                        <>
                          {channel.name.toLowerCase() != "general" && (
                            <>
                              <OpenModalButton
                                title="Delete Channel"
                                buttonText={<HiOutlineTrash />}
                                modalComponent={
                                  <DeleteChannelModal
                                    setPrevRoom={setPrevRoom}
                                    setCurRoom={setCurRoom}
                                    allChannels={allChannels}
                                    channel={channel}
                                    server={server}
                                  />
                                }
                              />

                              <OpenModalButton
                                title="Rename Channel"
                                buttonText={<HiOutlineDocumentText />}
                                modalComponent={
                                  <EditChannelModal
                                    channel={channel}
                                    serverId={channel.server_id}
                                  />
                                }
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </div>
      <div className={styles.profileBar}>
      <OpenModalButton
          title="View Profile"
          buttonText={
            <div className={styles.profileButton}>
              <img
                className={styles.userImage}
                src={user.image_url ? user.image_url : default_user}
                alt={`${user.username}'s profile`}
              />
              <div className={styles.userName}>{user.username}</div>
            </div>
          }
          modalComponent={<UserProfile />}
        />
        <OptionsMenu />
      </div>
    </main>
  );
}

export default ChannelsList;
