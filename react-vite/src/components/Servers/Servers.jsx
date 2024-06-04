import { useSelector, useDispatch } from "react-redux";
import { getServerIdThunk, selectServer, getAllServersThunk } from "../../redux/servers";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteServer from "../DeleteServerModal";

function ServersList() {
  const dispatch = useDispatch();
  const servers = useSelector((state) => state.server.servers);
  const currentUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllServersThunk())
  }, [dispatch])

  const handleServerClick = (serverId) => {
    dispatch(selectServer(serverId));
    dispatch(getServerIdThunk(serverId));
    navigate(`/servers/${serverId}`);
  };
  return (
    <ul>
      {servers?.map((server) => (
        <>
          <li key={server.id} onClick={() => handleServerClick(server.id)}>
            {server.name}
          </li>
          {server.owner_id == currentUser.id && (
            <div className="delete-button">
              <OpenModalMenuItem
                className="delete"
                itemText="Delete"
                modalComponent={<DeleteServer server={server} />}
              />
            </div>
          )}
        </>
      ))}
    </ul>
  );
}

export default ServersList;
