import { useSelector } from "react-redux";

function MessagesList() {
  const channel = useSelector((state) => state.channel.current);
  const server = useSelector((state) => state.server.current);

  if (!server) return "";
  if (!channel) return "Select a channel!";

  const messages = channel.messages;

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
