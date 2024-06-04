import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getServerIdThunk, getServersArray } from '../../redux/servers';
import ServersList from './Servers';
import { useNavigate } from 'react-router-dom';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import EditServerModal from '../EditServerModal';


function ServerDetails() {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    // const allServers = useSelector(getServersArray);
    const server = useSelector(state => state.server[serverId])

    useEffect(() => {
        if (serverId && !server) {
        dispatch(getServerIdThunk(server));
        }
    }, [serverId, server, dispatch]);

  if (!server) {
    return <div>Loading...</div>;
  }

    return (
        <div>
          <div>
            <h2 onClick={()=> navigate('/')}>All Servers</h2>
          </div>
          <div>
            <h2>{server?.name}</h2>
            <ul>
        {/* {server.owner_id === sessionUser.id && (
          <OpenModalMenuItem
            itemText="Edit Server"
            modalComponent={<EditServerModal server={server} />}
          />
        )} */}
      </ul>

          </div>
        </div>
      );
  }

  // return (
  //   <div>
  //     <h2>{server.name}</h2>
  //     <AllChannels server={server} />
  //   </div>
  // );



export default ServerDetails;
