import { useState, useEffect, useRef } from "react";
import styles from "./OptionsMenu.module.css";
import { useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session";
import { clearChannelsThunk } from "../../redux/channels";
import { clearCurrentMessagesThunk } from "../../redux/messages";
import { clearServersThunk } from "../../redux/servers";
import { HiCog6Tooth } from "react-icons/hi2";

function OptionsMenu() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
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
    dispatch(clearServersThunk());
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
          
          {/* {user.id === server.owner_id && <div>
            <OpenModalButton
            buttonText={"Create Channel"}
            modalComponent={<CreateChannelModal/>}
            />
            </div>} */}

          <>
            <div>
              <button onClick={logout}>Log Out</button>
            </div>
          </>
        </ul>
      )}
    </>
  );
}

export default OptionsMenu;
