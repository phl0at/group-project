import { useSelector, useDispatch } from "react-redux";
import { getAllServersThunk, selectServer } from "../../redux/servers";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


function ServersList() {

  const dispatch = useDispatch()
  const servers = useSelector((state) => state.server.servers)
  const navigate = useNavigate();


  // useEffect(() => {
  //   dispatch(getAllServersThunk());
  // }, [dispatch]);


  const handleServerClick = (serverId) => {
    dispatch(selectServer(serverId));
    // dispatch(getServerIdThunk(serverId));
    navigate(`/servers/${serverId}`);
  };

  return (
    <ul>
      {/* where DM is false  */}
      {servers?.map((server) => (
        <li key={server.id} onClick={()=> handleServerClick(server.id)}>{server.name}</li>

      

      ))}

    </ul>


  );
}

export default ServersList
