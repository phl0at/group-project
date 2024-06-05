import { getAllMessagesThunk, getMessagesArray } from "../../redux/messages";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function MessagesList() {
  return "NULL";
  const dispatch = useDispatch();
  const messages = useSelector(getMessagesArray);
  useEffect(() => {
    dispatch(getAllMessagesThunk(channel));
  }, []);

  if (!messages.length) return "No Messages Here!";

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}></div>
      ))}
    </>
  );
}

export default MessagesList;
