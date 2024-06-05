import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllServersThunk, getServersArray } from "../../redux/servers";
import ServersList from "../Servers/";
import ChannelsList from "../Channels/";
import MessagesList from "../Messages/";
import ProfileButton from "./ProfileButton/";
import "./MainComponent.css";
import { getAllChannelsThunk } from "../../redux/channels";
import { getAllMessagesThunk } from "../../redux/messages";

function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const allServers = useSelector(getServersArray);



  useEffect(() => {
    if (user) {
      dispatch(getAllServersThunk());
    }
  }, [user, dispatch]);

  return (
    <>
      <div>{/* <DirectButton /> */}</div>
      <div>
        <ProfileButton />
      </div>
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
  );
}

export default MainComponent;
