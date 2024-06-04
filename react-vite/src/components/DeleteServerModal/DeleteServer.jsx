import { deleteServerThunk } from "../../redux/servers";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import "./DeleteServer.css";

const DeleteServer = ({server}) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const onClick = async () => {
    try {
      await dispatch(deleteServerThunk(server));
      closeModal();
    } catch (e) {
      closeModal();
      return e;
    }
  };

  return (
    <>
      <div className="delete-server-menu">
        <h1 className="header">Confirm Delete</h1>
        <h5 className="header">Are you sure you want to delete this server?</h5>

        <button
          onClick={() => {
            onClick();
          }}
          className="shadow"
        >
          Yes (Delete Server)
        </button>
        <button
          className="shadow"
          onClick={() => {
            closeModal();
          }}
        >
          No (Keep Server)
        </button>
      </div>
    </>
  );
};

export default DeleteServer;
