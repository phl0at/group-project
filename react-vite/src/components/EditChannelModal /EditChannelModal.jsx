import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { setCurrentChannelThunk, updateChannelThunk } from "../../redux/channels";

const EditChannelModel = ({ channel }) => {
    const dispatch = useDispatch()
    const [name, setName] = useState(channel.name)
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    useEffect(() => {
        if (errors.length) {
            setErrors(errors)
        }
    }, [errors])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        if (!name.trim().length) {
            setErrors({ error: 'Channel name is required' });
        }

        try {
            const success = await dispatch(updateChannelThunk({
                id: channel.id,
                name: name,
            }));

            if (success) {
                dispatch(setCurrentChannelThunk(success))
                closeModal();
            } else {
                setErrors({ error: 'Failed to update channel' });
            }
        } catch (error) {
            setErrors({ error: 'An unexpected error occurred' });
        }

    }

    return (
        <>
            <h1>Edit Channel</h1>
            {errors.error && <p style={{ color: 'red' }}>{errors.error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Channel Name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <button type="submit">Update Channel</button>
            </form>
        </>
    );


}


export default EditChannelModel
