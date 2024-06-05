import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { updateServerThunk } from "../../redux/servers";

const EditServerModal = ({ server }) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [serverName, setServerName] = useState(server.name);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    useEffect(() => {
        if (errors.length) {
            setErrors(errors)

        }
    }, [errors])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            if (!serverName.trim().length) {
                setErrors({ error: 'Server Name is required' })
                // return;
            } else {
                await dispatch(
                    updateServerThunk({
                        serverName,
                        ownerId: sessionUser.id,
                    })
                );
                closeModal();
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <h1>Edit Server</h1>
            {errors.error && <p>{errors.error}</p>}
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
