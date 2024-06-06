import { getChannelsArray, setCurrentChannelThunk } from "../../redux/channels";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesThunk } from "../../redux/messages";
import OpenModalMenuItem from "../Main/OpenModalMenuItem";
import EditChannelModel from "../EditChannelModal ";
import { CiEdit } from "react-icons/ci";
import styles from "./Channels.module.css";

function ChannelsList() {
  const dispatch = useDispatch();
  const channels = useSelector(getChannelsArray);
  const server = useSelector((state) => state.server.current);

  if (!server) return "";
  if (!channels.length) return "No channels in this server!";

  const handleChannelClick = async (channel) => {
    await dispatch(setCurrentChannelThunk(channel));
    await dispatch(getAllMessagesThunk(channel));
  };

  return (
    <main className={styles.list}>
      <div className={styles.server}>{server.name}</div>
      ________
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

                <OpenModalMenuItem
                  itemText={<CiEdit />}
                  modalComponent={<EditChannelModel channel={channel} />}
                />
              </div>
            );

          }
        })}
    </main>
  );
}

export default ChannelsList;
