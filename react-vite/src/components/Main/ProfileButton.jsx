import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiArrowCircleDown } from "react-icons/hi";
import { thunkLogout } from "../../redux/session";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../Auth/LoginFormModal";
import SignupFormModal from "../Auth/SignupFormModal";
import styles from "./ProfileButton.module.css";
import { clearChannelsThunk } from "../../redux/channels";
import { clearCurrentMessagesThunk } from "../../redux/messages";
import { clearCurrentServerThunk } from "../../redux/servers";
import { Link } from "react-router-dom";
import { HiCog6Tooth } from "react-icons/hi2";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(clearCurrentServerThunk());
    dispatch(clearChannelsThunk());
    dispatch(clearCurrentMessagesThunk());
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <>
      <button onClick={toggleMenu}>
        <HiCog6Tooth />
      </button>
      {showMenu && (
        <ul className={styles.profile_dropdown} ref={ulRef}>
          {user ? (
            <>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
              <Link to="/profile" className={styles.profileButton}>
                profile
              </Link>
            </>
          ) : (
            <>
              <OpenModalButton
                buttonText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalButton
                buttonText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
