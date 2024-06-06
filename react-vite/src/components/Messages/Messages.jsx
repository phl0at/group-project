import { useDispatch, useSelector } from "react-redux";
import { createMessageThunk, getMessagesArray } from "../../redux/messages";
import styles from "./Messages.module.css";
import { useState } from "react";
import CreateChannelModal from "../Channels/CreateChannelModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { CiEdit } from "react-icons/ci";

function MessagesList() {
  const server = useSelector((state) => state.server.current);
  const channel = useSelector((state) => state.channel.current);
  const messages = useSelector(getMessagesArray);
  const user = useSelector((state) => state.session.user);
  const [inputText, setInputText] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

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
    } else if (inputText.length > 250) {
      setErrors({ error: "Max length: 250" });
    } else {
      await dispatch(createMessageThunk(channel, message));
      setInputText("");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.channelHead}>
      <h1>{channel.name}</h1>
        {server?.owner_id === user.id && (
          <OpenModalButton
            className={styles.channel}
            buttonText={
              <>
                Create Channel: <CiEdit />
              </>
            }
            modalComponent={<CreateChannelModal serverId={server.id} />}
          />
        )}
      </div>
      <div className={styles.list}>
        {messages.length > 0 &&
          messages.map((message) => {
            if (user.id === message.user_id) {
              return (
                // <DeleteMessage/>
                <div className={styles.message} key={message.id}>
                  {message.text}
                </div>
              );
            } else {
              return (
                <div className={styles.message} key={message.id}>
                  {message.text}
                </div>
              );
            }
          })}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            value={inputText}
            placeholder="Type your message here..."
            onChange={(e) => {
              setInputText(e.target.value);
              setErrors({});
            }}
          />
          <button className={styles.submit} type="submit">
            Send Message
          </button>
          <div className={styles.error}>{errors.error && errors.error}</div>
        </form>
      </div>
    </main>
  );
}

export default MessagesList;
