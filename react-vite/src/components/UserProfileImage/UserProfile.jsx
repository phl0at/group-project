import React from 'react';
import { useSelector } from 'react-redux';
import UserProfileImageUpload from './UserProfileUpload';
import default_user from "../../../../images/default_user.jpg"

const UserProfile = () => {
    const user = useSelector((state) => state.session.user);

    return (
      <div >
        <h1>{user.username}'s Profile</h1>
        <img
          src={user.image_url || default_user}
          alt={`${user.username}'s profile`}
        />
        <UserProfileImageUpload />
      </div>
    );
  };

  export default UserProfile
