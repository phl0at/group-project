import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllServersThunk } from "../../redux/servers";
import ServersList from "../Servers/Servers";
import "./Navigation.css";

function AllServers() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user)

  useEffect(() => {
    if (user) {
      dispatch(getAllServersThunk());
    }
  }, [user, dispatch]);

  return (
    <ul>
      <li>
       {user && <ServersList />}
      </li>

    </ul>
  );
}

export default AllServers;
