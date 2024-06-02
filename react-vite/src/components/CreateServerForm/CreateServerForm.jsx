import styles from './CreateServerForm.module.css'
import { useState } from "react";
import { thunkCreateServer } from "../../redux/server";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const CreateServerForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [serverName, setServerName] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [errors, setErrors] = useState({});

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
            navigate('/')
        }
    };


    if (sessionUser) {
        setOwnerId(sessionUser.id)
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
}




export default CreateServerForm
