import React from 'react';
import { useSelector } from 'react-redux';
import UserProfileImageUpload from './UserProfileUpload';


const UserProfile = () => {
    const user = useSelector((state) => state.session.user);
  
    return (
      <div >
        <h1>{user.username}'s Profile</h1>
        <img
          src={user.image[0]?.img_url || '/default_profile.png'}
          alt={`${user.username}'s profile`}
        />
        <UserProfileImageUpload />
      </div>
    );
  };

  export default UserProfile
