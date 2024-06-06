import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteChannelThunk } from "../../../redux/channels";

const DeleteChannelModal = ({ channel, serverId }) => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const handleDelete = async () => {
        setErrors({});
        try {


            const response = await dispatch(deleteChannelThunk(channel, serverId));

            if (response) {
                closeModal()
            } else {
                setErrors({ error: 'Failed to delete the channel' });
            }
        } catch (error) {
            setErrors({ error: 'An unexpected error occurred' });
        }
    };

    return (
        <>
            <h1>Are you sure you want to delete {channel.name} channel?</h1>
            {errors.error && <p style={{ color: 'red' }}>{errors.error}</p>}
            <div>
                <button onClick={handleDelete}>Yes</button>
                <button onClick={closeModal}>No</button>
            </div>
        </>
    );
};

export default DeleteChannelModal;
