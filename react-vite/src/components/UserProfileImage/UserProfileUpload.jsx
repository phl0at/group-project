// UserProfileImage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createImageThunk, getImageArray } from '../../redux/images';

const UserProfileImageUpload = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
  
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!file) {
        setError("Please select a file.");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "user");
      formData.append("type_id", user.id);
  
      const result = await dispatch(createImageThunk(formData));
      if (result.errors) {
        setError(result.errors);
      } else {
        setError(null);
        setFile(null);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
        {error && <p>{error}</p>}
      </form>
    );
  };


export default UserProfileImageUpload;
