import { HiOutlineDocumentText } from "react-icons/hi2";
import { HiOutlineTrash } from "react-icons/hi2";
import {
  getChannelsArray,
  setCurrentChannelThunk,
  setLastChannelThunk,
} from "../../redux/channels";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesThunk } from "../../redux/messages";

import EditChannelModal from "./EditChannelModal ";
import DeleteChannelModal from "./DeleteChannelModal";
import styles from "./Channels.module.css";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useEffect, useRef } from "react";
import OptionsMenu from "./OptionsMenu";
import { NavLink } from "react-router-dom";
import default_user from "../../../../images/default_user.jpg";
import ServerMenu from "./ServerMenu";

function ChannelsList({ socket }) {
  const dispatch = useDispatch();
  const allChannels = useSelector(getChannelsArray);
  const currChannel = useSelector((state) => state.channel.current);
  const lastChannel = useSelector((state) => state.channel.last);
  const server = useSelector((state) => state.server.current);
  const user = useSelector((state) => state.session.user);

  const handleChannelClick = async (channel) => {
    socket.emit("leave", { room: lastChannel.id });
    await dispatch(setCurrentChannelThunk(channel));

    socket.emit("join", { room: channel.id });
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
        <div className={styles.channel_list}>
          {server &&
            allChannels.map((channel) => {
              const selected = currChannel?.id === channel.id ? true : false;
              if (channel.server_id === server.id) {
                return (
                  <div
                    id={`${selected ? "selected" : ""}`}
                    className={styles.channel}
                    key={channel.id}
                  >
                    <button
                      className={styles.channel_name}
                      onClick={(e) => {
                        e.preventDefault();
                        handleChannelClick(channel);
                      }}
                    >
                      {channel.name}
                    </button>

                    <div className={styles.channel_buttons}>
                      {server.owner_id === user.id && (
                        <>
                          <OpenModalButton
                            title="Delete Channel"
                            buttonText={<HiOutlineTrash />}
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
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </div>
      <div className={styles.profileBar}>
        <div>
          <NavLink to="/profile" className={styles.profileButton}>
            <img
              className={styles.userImage}
              src={user.image_url ? user.image_url : default_user}
            />
            <div className={styles.userName}>{`${user.username}`}</div>
          </NavLink>
        </div>
        <OptionsMenu socket={socket} />
      </div>
    </main>
  );
}

export default ChannelsList;
