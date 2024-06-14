import React from 'react';
import { useSelector } from 'react-redux';
import UserProfileImageUpload from './UserProfileUpload';
import default_user from "../../../../images/default_user.jpg"

import styles from './UserProfile.module.css'

const UserProfile = () => {
    const user = useSelector((state) => state.session.user);

    return (
      <div className={styles.profileContainer}>
        <h1 className={styles.profileTitle}>{user.username}'s Profile</h1>
        <img className={styles.profileImage}
          src={user.image_url || default_user}
          alt={`${user.username}'s profile`}
        />
        <UserProfileImageUpload className={styles.button}/>
      </div>
    );
  };

  export default UserProfile
