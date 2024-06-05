import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllServersThunk } from "../../redux/servers";
import ServersList from "../Servers/Servers";
// import ServerDetails from "../Servers/ServerDetails";
import ProfileButton from "./ProfileButton";
import AllChannels from "../Channels/Channels";
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
      <ul>
        <li>
          {/* <DirectButton /> */}
        </li>
        <li>
          <ProfileButton />
        </li>
        <li>
          <ServersList />
          {/* <ServerDetails /> */}
        </li>
        <ul>
          <li>{/* <ChannelsList /> */}</li>
          <li> 
            <AllChannels/>
          </li>
        </ul>
      </ul>
      <ul>
        <li>
          {/* <MessagesList /> */}
        </li>
      </ul>
    </>
  );
}

export default MainComponent;
