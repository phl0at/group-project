// UserProfileImage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUserThunk } from '../../redux/session';
import { useNavigate } from "react-router-dom";

const UserProfileImageUpload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
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
    formData.append("id", user.id);

    const result = await dispatch(editUserThunk(formData, user.id));
    if (result.errors) {
      setError(result.errors);
    } else {
      setError(null);
      setFile(null);
      navigate('/')
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
