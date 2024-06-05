import { useSelector, useDispatch } from "react-redux";
import { getAllServersThunk, getServersArray } from "../../redux/servers";
import { useEffect } from "react";
import { getAllChannelsThunk } from "../../redux/channels";

function ServersList() {
  const dispatch = useDispatch();
  const servers = useSelector(getServersArray);

  useEffect(() => {
    dispatch(getAllServersThunk());
  }, [dispatch]);

  const handleServerClick = (server) => {
    dispatch(getAllChannelsThunk(server));
  };
  return (
    <ul>
      {servers?.map((server, i) => (
        <div key={i}>
          <button
            key={server.id}
            onClick={(e) => {
              e.preventDefault();
              return handleServerClick(server);
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
