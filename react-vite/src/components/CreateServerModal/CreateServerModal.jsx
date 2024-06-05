// import styles from './CreateServerModal.module.css'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createServerThunk } from "../../redux/servers";
import { useEffect } from "react";

const CreateServerModal = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [serverName, setServerName] = useState("");
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
                    createServerThunk({
                        serverName,
                        ownerId: sessionUser.id,
                    })
                );
                closeModal();
            }
        } catch (e) {
            console.log('!!!!!!!!!!!!!!!!!!!', e)
        }
    }

    return (
        <>
            <h1>Create Server</h1>
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
                <button type="submit">Create Server</button>
            </form>
        </>
    );
}



export default CreateServerModal
