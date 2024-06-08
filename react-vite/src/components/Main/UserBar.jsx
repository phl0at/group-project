import styles from "./Main.module.css";
import ProfileButton from "./ProfileButton";
import default_user from "../../../../images/default_user.jpg";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation


function UserBar() {
  const channel = useSelector((state) => state.channel.current);
  const server = useSelector((state) => state.server.current);
  const user = useSelector((state) => state.session.user);
  const srcImg = user?.image[0]?.img_url ? user.image[0].img_url : default_user

  
  return (

      <div className={styles.nav}>
        <div className={styles.direct}>
          <img src={srcImg} className={styles.directImg} />
          <ProfileButton className={styles.profile} />
        </div>
        {server && <h3 className={styles.server}>{server.name}</h3>}
        {channel && <h2 className={styles.channel}>{channel.name}</h2>}
        
       </div>
  
  );
}

export default UserBar;
