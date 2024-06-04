import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { updateServerThunk } from "../../redux/servers";

const EditServerModal = ({ server }) => {
    const dispatch = useDispatch();
    const [serverName, setServerName] = useState(server.name);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!serverName) {
            setErrors({ ServerNameRequired: 'Server Name is required' });
            return;
        }

        const serverResponse = await dispatch(
            updateServerThunk({
                id: server.id,
                name: serverName
            })
        );
        if (serverResponse.errors) {
            setErrors(prevErrors => ({ ...prevErrors, ...serverResponse.errors }));
        } else {
            closeModal();
        }
    };

    return (
        <>
            <h1>Edit Server</h1>
            {errors.ServerNameRequired && <p>{errors.ServerNameRequired}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Server Name
                    <input
                        type="text"
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Update Server</button>
            </form>
        </>
    );
}

export default EditServerModal;
