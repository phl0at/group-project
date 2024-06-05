import { useSelector } from "react-redux";
import { getMessagesArray } from "../../redux/messages";

function MessagesList() {
  const server = useSelector((state) => state.server.current);
  const messages = useSelector(getMessagesArray);

  if (!server) return "";
  if (!messages) return "Select a channel!";

  return (
    <>
      <div>
        {messages.length > 0 &&
          messages.map((message) => <div key={message.id}>{message.text}</div>)}
      </div>
      <div>
        {messages.length === 0 && <div>No messages in this channel!</div>}
      </div>
    </>
  );
}

export default MessagesList;
