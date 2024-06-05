import { useSelector, useDispatch } from "react-redux";
import { getServerIdThunk, getServersArray } from "../../redux/servers";
import { getAllChannelsThunk } from "../../redux/channels";

function ServersList() {
  const dispatch = useDispatch();
  const servers = useSelector(getServersArray);

  const handleServerClick = (server) => {
    dispatch(getAllChannelsThunk(server));
    dispatch(getServerIdThunk(server))
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
