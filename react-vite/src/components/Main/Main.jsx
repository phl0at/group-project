import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  clearCurrentServerThunk,
  getAllServersThunk,
} from "../../redux/servers";
import ServersList from "../Servers/Servers";
import ProfileButton from "./ProfileButton";
import ChannelsList from "../Channels/";
import MessagesList from "../Messages/";
import styles from "./Main.module.css";
import OpenModalButton from "../OpenModalButton";
import CreateChannelModal from "../Channels/CreateChannelModal";
import default_user from "../../../../images/default_user.jpg";
import { clearCurrentChannelThunk } from "../../redux/channels";
import { clearCurrentMessagesThunk } from "../../redux/messages";
function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const channel = useSelector((state) => state.channel.current);
  const server = useSelector((state) => state.server.current);
  const srcImg = user.image[0]?.img_url ? user.image[0]?.img_url : default_user;
  useEffect(() => {
    if (user) {
      const getServers = async () => {
        await dispatch(getAllServersThunk());
        dispatch(clearCurrentServerThunk());
        dispatch(clearCurrentChannelThunk());
        dispatch(clearCurrentMessagesThunk());
      };
      getServers();
    }
  }, [user, dispatch]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.nav}>
          <button className={styles.direct}>
            <img src={srcImg} className={styles.directImg} />
            <ProfileButton className={styles.profile} />
          </button>
          <h3 className={styles.server}>{server?.name}</h3>
          <h1 className={styles.channel}>{channel?.name}</h1>
        </div>

        {server?.owner_id === user.id && (
          <OpenModalButton
            className={styles.channel}
            buttonText="Create Channel"
            modalComponent={<CreateChannelModal serverId={server.id} />}
          />
        )}
      </div>

      {user && (
        <main className={styles.page}>
          {/* <DirectButton /> */}

          <ServersList />

          <ChannelsList />

          <MessagesList />
        </main>
      )}
    </>
  );
}

export default MainComponent;
