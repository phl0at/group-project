import { useSelector, useDispatch } from "react-redux";
import { getServerIdThunk, selectServer } from "../../redux/servers";
import { useNavigate } from 'react-router-dom';

function ServersList() {

  const dispatch = useDispatch()
  const servers = useSelector((state) => state.server.servers)
  const navigate = useNavigate();


  const handleServerClick = (serverId) => {
    dispatch(selectServer(serverId));
    dispatch(getServerIdThunk(serverId));
    navigate(`/servers/${serverId}`);
  };

  return (
    <ul>
      {servers?.map((server) => (
        <li key={server.id} onClick={()=> handleServerClick(server.id)}>{server.name}</li>
      ))}

    </ul>


  );
}

export default ServersList
