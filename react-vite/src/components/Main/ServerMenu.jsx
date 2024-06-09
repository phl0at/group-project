import { useState, useEffect, useRef } from "react";
import styles from "./ServerMenu.module.css";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import OpenModalButton from "../OpenModalButton";
import CreateChannelModal from "../Channels/CreateChannelModal";
import EditServerModal from "../Servers/EditServerModal";
import DeleteServer from "../Servers/DeleteServerModal/DeleteServer";
function ServerMenu() {
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

  return (
    <div className={styles.servermenu}>
      <button onClick={toggleMenu}>
      <HiMiniAdjustmentsHorizontal />
      </button>
      {showMenu && (
        <ul className={styles.profile_dropdown} ref={ulRef}>
          <div>
            <OpenModalButton
              onButtonClick={closeMenu}
              buttonText={"Create Channel"}
              modalComponent={<CreateChannelModal />}
            />
          </div>
          <div className={styles.serverEdit}>
            <OpenModalButton
              title="Rename Server"
              buttonText={"Rename Server"}
              modalComponent={<EditServerModal />}
            />
            <div className={styles.delete}>
              <OpenModalButton
                title={"Delete Server"}
                buttonText={"Delete Server"}
                modalComponent={<DeleteServer />}
              />
            </div>
          </div>
        </ul>
      )}
    </div>
  );
}

export default ServerMenu;
