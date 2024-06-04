import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getServerIdThunk } from '../../redux/servers';


function ServerDetails() {
    const { serverId } = useParams();
    const dispatch = useDispatch();

    const servers = useSelector((state) => state.server.servers);
  
    const server = servers?.find((server) => server.id === parseInt(serverId, 10));


    useEffect(() => {
        if (serverId && !server) {
        dispatch(getServerIdThunk(serverId));
        }
    }, [serverId, server, dispatch]);

    // if (!server) {
    //     return <div>Loading...</div>;
    // }


      return (
        <div>
          <h2>{server?.name}</h2>
          <ul>
            {server?.channels.map((channel) => (
              <li key={channel.id}>{channel.name}</li>
            ))}
          </ul>
        </div>
      );
  }
  
  export default ServerDetails;
