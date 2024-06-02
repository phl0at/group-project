import styles from './CreateServerModal.module.css'
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateServer } from "../../redux/server";


const CreateServerModal = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [serverName, setServerName] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!serverName) setErrors({ ServerNameRequired: 'Server Name is required' })
        const serverResponse = await dispatch(
            thunkCreateServer({
                serverName,
                ownerId,
            })
        );

        if (serverResponse.errors) {
            setErrors(prevErrors => ({ ...prevErrors, ...data.errors }))
        } else {
            setOwnerId(sessionUser.id)
            closeModal();
        }
    };

    return (
        <>
            <h1>Create Server</h1>
            {errors.length > 0 && <p>{errors.name}</p>}
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
                <button type="submit">Create Server</button>
            </form>
        </>
    );
}






export default CreateServerModal
