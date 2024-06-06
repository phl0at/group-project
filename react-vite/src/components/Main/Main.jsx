import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllServersThunk } from "../../redux/servers";
import ServersList from "../Servers/Servers";
import ProfileButton from "./ProfileButton";
import ChannelsList from "../Channels/";
import MessagesList from "../Messages/";
import styles from "./Main.module.css";

function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (user) {
      const getServers = async () => {
        await dispatch(getAllServersThunk());
      };
      getServers();
    }
  }, [user, dispatch]);

  return (
    <>
      <ProfileButton className={styles.profile} />

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
