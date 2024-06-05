import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllServersThunk } from "../../redux/servers";
import ServersList from "../Servers/";
import ChannelsList from "../Channels/";
import MessagesList from "../Messages/";
import ProfileButton from "./ProfileButton/";
import "./MainComponent.css";

function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (user) {
      dispatch(getAllServersThunk());
    }
  }, [user, dispatch]);

  return (
    <>
      <div>
        <ProfileButton />
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
