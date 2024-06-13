import { useState, useEffect, useRef } from "react";
import styles from "./OptionsMenu.module.css";
import { useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session";
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
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <main>
      <button  onClick={toggleMenu}>
        <HiCog6Tooth size="25" />
      </button>
      {showMenu && (
        <ul ref={ulRef}>
          <div>
            <button className={styles.profile_dropdown} onClick={logout}>
              Log Out
            </button>
          </div>
        </ul>
      )}
    </main>
  );
}

export default OptionsMenu;
