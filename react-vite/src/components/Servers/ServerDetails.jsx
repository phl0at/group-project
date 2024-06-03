import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getServerIdThunk } from '../../redux/servers';
import { useParams } from 'react-router-dom';

function ServerDetails() {
    const { serverId } = useParams();
    const dispatch = useDispatch();

    const servers = useSelector((state) => state.server.servers);

    // console.log('Server ID from params:', serverId); // Log the serverId
    // console.log('Type of serverId:', typeof serverId); // Log the type of serverId
    // console.log('Servers:', servers); // Log the servers array
  
    const server = servers?.find((server) => server.id === parseInt(serverId, 10));


    // useEffect(() => {
    //     if (serverId && !server) {
    //     dispatch(getServerIdThunk(serverId));
    //     }
    // }, [serverId, server, dispatch]);

    if (!server) {
        return <div>Loading...</div>;
    }


      return (
        <div>
          <h2>{server.name}</h2>
          <ul>
            {server.channels.map((channel) => (
              <li key={channel.id}>{channel.name}</li>
            ))}
          </ul>
        </div>
      );
  }
  
  export default ServerDetails;
