import { getChannelsArray, setCurrentChannelThunk } from "../../redux/channels";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesThunk } from "../../redux/messages";
import OpenModalMenuItem from "../Main/OpenModalMenuItem";
import EditChannelModel from "../EditChannelModal ";
import { CiEdit } from "react-icons/ci";
import styles from "./Channels.module.css";

import CreateChannelModal from "../Channels/CreateChannelModal";

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
      <main className={styles.main}>
        <div className={styles.server}>{server.name}</div>
        ________
        <div className={styles.list}>
          {server &&
            channels.map((channel) => {
              if (channel.server_id === server.id) {
                return (
                  <div key={channel.id}>
                    <button
                      className={styles.channel}
                      onClick={(e) => {
                        e.preventDefault();
                        handleChannelClick(channel);
                      }}
                    >
                      {channel.name}
                    </button>
                    {user.id === server.owner_id && (
                      <OpenModalMenuItem
                        itemText={<CiEdit />}
                        modalComponent={<EditChannelModel channel={channel} />}
                      />
                    )}
                  </div>
                );
              }
            })}
        </div>
        <div className={styles.create}>
          {server?.owner_id === user.id && (
            <OpenModalMenuItem
              className={styles.channel}
              itemText={"Create Channel"}
              modalComponent={<CreateChannelModal serverId={server.id} />}
            />
          )}
        </div>
      </main>
    </>
  );
}

export default ChannelsList;
