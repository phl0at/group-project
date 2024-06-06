import { useDispatch, useSelector } from "react-redux";
import {
  createMessageThunk,
  getAllMessagesThunk,
  getMessagesArray,
} from "../../redux/messages";
import "./Messages.module.css";
import { useEffect, useState } from "react";
import MessageReactions from "../Reactions";

function MessagesList() {
  const server = useSelector((state) => state.server.current);
  const channel = useSelector((state) => state.channel.current);
  const messages = useSelector(getMessagesArray);
  const user = useSelector((state) => state.session.user.id);
  const [inputText, setInputText] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (channel) {
      dispatch(getAllMessagesThunk(channel));
    }
  }, [dispatch, channel]);

  useEffect(() => {
    if (errors.length) {
      setErrors(errors);
      setInputText("");
    }
  }, [errors]);

  if (!server || !channel) return "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const message = {
      channel_id: channel.id,
      text: inputText,
    };
    if (!inputText.trim().length) {
      setErrors({ error: "Message Text Required" });
    } else if (inputText.length < 1 || inputText.length > 250) {
      setErrors({ error: "Max length: 250" });
    } else {
      await dispatch(createMessageThunk(channel, message));
      setInputText("");
    }
  };

  return (
    <main>
      <div>
        {messages.length > 0 &&
          messages.map((message) => (
            <div key={message.id} className="message">
              <div>{message.text}</div>
              <MessageReactions message={message} />
            </div>
          ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          placeholder="Type your message here..."
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">Send Message</button>
        {errors.error && errors.error}
      </form>
    </main>
  );
}

export default MessagesList;
