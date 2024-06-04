import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllServersThunk } from "../../redux/servers";
import ServersList from "../Servers/Servers";
import ProfileButton from "./ProfileButton"
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
   
      {user && (
        <>
          <li>
            <ServersList />          
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
