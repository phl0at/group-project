import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import ProfileButton from "./ProfileButton";
import { getAllServersThunk } from "../../redux/servers";
import ServersList from "../Servers/Servers";
import ServerDetails from "../Servers/ServerDetails";
import "./Navigation.css";

function Navigation() {
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
        <NavLink to="/">Home</NavLink>
      </li>

      {user && (
        <>
          <li>
            <ServersList />  
            <ServerDetails />        
          </li>
        </>
      )}

      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
