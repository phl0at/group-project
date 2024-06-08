import { CiEdit } from "react-icons/ci";
import { HiBan } from "react-icons/hi";
import { getChannelsArray, setCurrentChannelThunk } from "../../redux/channels";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesThunk } from "../../redux/messages";
import EditChannelModal from "../EditChannelModal ";
import DeleteChannelModal from "./DeleteChannelModal";
import EditServerModal from "../Servers/EditServerModal";
import styles from "./Channels.module.css";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteServer from "../Servers/DeleteServerModal/DeleteServer";
import { useEffect } from "react";
import ProfileButton from "../Main/ProfileButton";


function ChannelsList() {
  const dispatch = useDispatch();
  const allChannels = useSelector(getChannelsArray);
  const channel = useSelector((state) => state.channel.current);
  const server = useSelector((state) => state.server.current);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (channel == {}) {
      dispatch(setCurrentChannelThunk(allChannels[0]));
    }
  }, []);

  const handleChannelClick = async (channel) => {
    await dispatch(setCurrentChannelThunk(channel));
    await dispatch(getAllMessagesThunk(channel));
  };

  return (
    <div>
      <main className={styles.main}>
        <div className={styles.serverEdit}>
          <div className={styles.delete}>
            {server && user.id === server.owner_id && (
              <OpenModalButton
                title={"Delete Server"}
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
            allChannels.map((channel) => {
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
                            <DeleteChannelModal
                              allChannels={allChannels}
                              channel={channel}
                              server={server}
                            />
                          }
                        />
                        <OpenModalButton
                          title="Rename Channel"
                          buttonText={<CiEdit />}
                          modalComponent={
                            <EditChannelModal
                              channel={channel}
                              serverId={channel.server_id}
                            />
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              }
            })}

        </div>
      </main>
      <main className={styles.profileBar}>
        <ProfileButton className={styles.profile} />
      </main>
    </div>
  );
}

export default ChannelsList;
