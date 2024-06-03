import { useSelector, useDispatch } from "react-redux";
import { getServerIdThunk } from "../../redux/servers";


function ServersList() {
  const servers = useSelector((state) => state.server.servers)
  const dispatch = useDispatch()

  const handleServerClick = (serverId) => {
    dispatch(getServerIdThunk(serverId));
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
