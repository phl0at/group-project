import { useSelector, useDispatch } from "react-redux";
import { getServersArray, setCurrentServerThunk } from "../../redux/servers";
import { clearCurrentChannelThunk, getAllChannelsThunk } from "../../redux/channels";
import { clearCurrentMessagesThunk } from "../../redux/messages";

function ServersList() {
  const dispatch = useDispatch();
  const servers = useSelector(getServersArray);

  const handleServerClick = (server) => {
    dispatch(getAllChannelsThunk(server));
    dispatch(setCurrentServerThunk(server))
    dispatch(clearCurrentMessagesThunk())
    dispatch(clearCurrentChannelThunk())
  };

  return (
    <ul>
      {servers?.map((server, i) => (
        <div key={i}>
          <button
            key={server.id}
            onClick={(e) => {
              e.preventDefault();
              handleServerClick(server);
            }}
          >
            {server.name}
          </button>
        </div>
      ))}
    </ul>
  );
}

export default ServersList;
