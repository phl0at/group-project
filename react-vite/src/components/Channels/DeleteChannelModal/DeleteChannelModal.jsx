import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteChannelThunk } from "../../../redux/channels";

const DeleteChannelModal = ({ channel }) => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleDelete = async () => {
        setErrors({});
        try {
            const response = await dispatch(deleteChannelThunk(channel));

            if (response) {
                setErrors({ error: 'Failed to delete the channel' });
            } else {
                closeModal()
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
