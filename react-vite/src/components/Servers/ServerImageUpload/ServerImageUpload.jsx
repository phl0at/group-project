import { useState } from "react";

const ServerImageUpload = ({ setImage }) => {
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setError(null);
    } else {
      setError("Please select a valid file.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {error && <p>{error}</p>}
    </div>
  );
};

export default ServerImageUpload;
