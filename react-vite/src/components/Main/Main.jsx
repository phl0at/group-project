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
      const getUsers = async () => {
        await dispatch(getAllServersThunk());
      };
      getUsers()
    }
  }, [user, dispatch]);

  return (
    <>
      <div>
        <ProfileButton className={styles.profile}/>
      </div>
      {user && (
        <>
          <div>{/* <DirectButton /> */}</div>
          <div>
            <ServersList />
          </div>
          <div>
            <ChannelsList />
          </div>
          <div>
            <MessagesList />
          </div>
        </>
      )}
    </>
  );
}

export default MainComponent;
