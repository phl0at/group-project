import { CiEdit } from "react-icons/ci";
import { HiBan } from "react-icons/hi";
import { getChannelsArray, setCurrentChannelThunk } from "../../redux/channels";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesThunk } from "../../redux/messages";
import EditChannelModal from "../EditChannelModal ";
import DeleteChannelModal from "./DeleteChannelModal";
import styles from "./Channels.module.css";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useEffect } from "react";
import OptionsMenu from "./OptionsMenu";
import { NavLink } from "react-router-dom";
import default_user from "../../../../images/default_user.jpg";
import ServerMenu from "./ServerMenu";

function ChannelsList() {
  const dispatch = useDispatch();
  const allChannels = useSelector(getChannelsArray);
  const server = useSelector((state) => state.server.current);
  const user = useSelector((state) => state.session.user);
  const src = user.image_url ? user.image_url : default_user;

  useEffect(() => {
    dispatch(setCurrentChannelThunk(allChannels[0]));
  }, []);

  const handleChannelClick = async (channel) => {
    await dispatch(setCurrentChannelThunk(channel));
    await dispatch(getAllMessagesThunk(channel));
  };

  return (
    <main className={styles.main}>
      <div className={styles.list}>
        {server && (
          <div className={styles.server}>
            <div className={styles.server_name}>{server.name}</div>
            {server.owner_id === user.id && <ServerMenu />}
          </div>
        )}
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
                    <div className={styles.channel_buttons}>
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
                    </div >
                  )}
                </div>
              );
            }
          })}
      </div>
      <div className={styles.profileBar}>
        <div>
          <NavLink to="/profile" className={styles.profileButton}>
            <img className={styles.userImage} src={src} />
            <div className={styles.userName}>{`${user.username}`}</div>
          </NavLink>
        </div>
        <OptionsMenu />
      </div>
    </main>
  );
}

export default ChannelsList;
