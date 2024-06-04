import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getServerIdThunk } from '../../redux/servers';
import ServersList from './Servers';
import { useNavigate } from 'react-router-dom';



function ServerDetails() {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const allServers = useSelector((state) => Object.values(state.server));
  
    const server = allServers?.find((server) => server.id === parseInt(serverId, 10));


    useEffect(() => {
        if (serverId && !server) {
        dispatch(getServerIdThunk(serverId));
        }
    }, [serverId, server, dispatch]);


    return (
        <div>
          <div>
            <h2 onClick={()=> navigate('/')}>All Servers</h2>
            <ServersList /> {/* Displaying all servers */}
          </div>
          <div>
            <h2>{server?.name}</h2>
            <ul>
              {server?.channels.map((channel) => (
                <li key={channel.id}>{channel.name}</li>
              ))}
            </ul>
          </div>
        </div>
      );
  }
  
  export default ServerDetails;
