import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllServersThunk, setCurrentServerThunk } from "../../redux/servers";
import ServersList from "../Servers/Servers";
import ProfileButton from "./ProfileButton";
import ChannelsList from "../Channels/";
import MessagesList from "../Messages/";
import styles from "./Main.module.css";
import OpenModalButton from "../OpenModalButton";
import CreateChannelModal from "../Channels/CreateChannelModal";
import default_user from "../../../../images/default_user.jpg";
import {
  getAllChannelsThunk,
} from "../../redux/channels";
import { getAllMessagesThunk } from "../../redux/messages";
import { getAllReactionsThunk } from "../../redux/reactions";
import BeatLoader from "react-spinners/BeatLoader";

function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const channel = useSelector((state) => state.channel.current);
  const server = useSelector((state) => state.server.current);
  const srcImg = user?.image[0]?.img_url ? user.image[0].img_url : default_user;

  useEffect(() => {
    if (user) {
      const getServers = async () => {
        const allServers = await dispatch(getAllServersThunk());
        if (allServers.length) {
          await dispatch(setCurrentServerThunk(allServers[0]));
        }
        const allChannels = await dispatch(getAllChannelsThunk(allServers[0]));
        if (allChannels.length) {
          // await dispatch(setCurrentChannelThunk(allChannels[0]));
          await dispatch(getAllMessagesThunk(allChannels[0]));
          await dispatch(getAllReactionsThunk());
        }
      };
      getServers();
    }
  }, []);

  if (!server || !user) return <BeatLoader className={styles.loading} color="#3c84bb" />;

  return (
    <>
      {user ? (
        <>
          <div className={styles.header}>
            <div className={styles.nav}>
              <div className={styles.direct}>
                <img src={srcImg} className={styles.directImg} />
                <ProfileButton className={styles.profile} />
              </div>
              <h3 className={styles.server}>{server?.name}</h3>
              <h2 className={styles.channel}>{channel?.name}</h2>
            </div>

            {server.owner_id === user.id && (
              <OpenModalButton
                className={styles.channel}
                buttonText="Create Channel"
                modalComponent={<CreateChannelModal serverId={server.id} />}
              />
            )}
          </div>
          <main className={styles.page}>
            <ServersList />
            <ChannelsList />
            <MessagesList />
          </main>
        </>
      ) : (
        <div className={styles.header}>
          <div className={styles.nav}>
            <div className={styles.direct}>
              <img src={srcImg} className={styles.directImg} />
              <ProfileButton className={styles.profile} />
            </div>
            <h3 className={styles.server}>{server?.name}</h3>
            <h2 className={styles.channel}>{channel?.name}</h2>
          </div>
        </div>
      )}
    </>
  );
}

export default MainComponent;
