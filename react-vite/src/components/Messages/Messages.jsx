import { useDispatch, useSelector } from "react-redux";
import styles from "./Messages.module.css";
import {
  createMessageThunk,
  getMessagesArray,
  editMessageThunk,
} from "../../redux/messages";
import { useEffect, useState, useRef } from "react";
import OpenModalButton from "../OpenModalButton/";
import { thunkGetAll } from "../../redux/session";
import default_user from "../../../../images/default_user.jpg";
import MessageReactions from "../Reactions";
import DeleteMessage from "./DeleteMessageModal/";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { HiOutlineTrash } from "react-icons/hi2";
import { VscReactions } from "react-icons/vsc";
import { socket } from "../../socket";
import ReactionButton from "../Reactions/ReactionButton";

function MessagesList({ curRoom, prevRoom }) {
  const dispatch = useDispatch();
  const messages = useSelector(getMessagesArray);
  const currChannel = useSelector((state) => state.channel.current);
  const user = useSelector((state) => state.session.user);
  const allUsers = useSelector((state) => state.session);
  const [inputText, setInputText] = useState("");
  const [errors, setErrors] = useState({});
  const [editText, setEditText] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [showReactions, setShowReactions] = useState(null);

  const scroll = useRef(null);

  useEffect(() => {
    dispatch(thunkGetAll());
  }, []);

  useEffect(() => {
    socket.emit("leave", { room: prevRoom });
    socket.emit("join", { room: curRoom });
    setInputText("");
  }, [curRoom]);

  useEffect(() => {
    if (messages.length) {
      scroll.current.scrollTop = scroll.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const message = {
      channel_id: currChannel.id,
      text: inputText,
    };

    if (inputText.length > 250) {
      setErrors({ error: "Max length: 250" });
    } else {
      dispatch(createMessageThunk(currChannel.id, message));
      socket.emit("message", { room: currChannel.id, message });
      setInputText("");
    }
  };

  const handleEditSubmit = (message) => {
    if (!editText.trim().length) {
      setErrors({ error: "Message Text Required" });
    } else if (editText.length > 250) {
      setErrors({ error: "Max length: 250" });
    } else {
      dispatch(editMessageThunk({ id: message.id, text: editText }));
      socket.emit("message", { room: currChannel.id, message });
      setEditMode(null);
      setEditText("");
    }
  };

  const toggleReactions = (messageId) => {
    setShowReactions((prev) => (prev === messageId ? null : messageId));
  };

  return (
    <main className={styles.main}>
      <div className={styles.channel}>{currChannel && currChannel.name}</div>
      <div className={styles.body}>
        <div ref={scroll} className={styles.scroll}>
          <div className={styles.message_list}>
            {messages.map((message) => {
              if (message.channel_id === currChannel?.id) {
                const author = allUsers[message.user_id];
                return (
                  <main key={message.id} className={styles.message_body}>
                    <div className={styles.left}>
                      <img
                        className={styles.user_image}
                        src={
                          author?.image_url ? author.image_url : default_user
                        }
                      />
                    </div>
                    <div className={styles.right}>
                      <div className={styles.user_info}>
                        <div className={styles.user_name}>
                          {author?.username}
                        </div>
                        <div className={styles.message}>
                          {editMode === message.id ? (
                            <form
                              className={styles.edit_form}
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleEditSubmit(message);
                              }}
                            >
                              <input
                                className={styles.message_edit}
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                required
                              />
                              <div className={styles.message_buttons}>
                                <button
                                  className={styles.save_edit}
                                  type="submit"
                                >
                                  Save
                                </button>
                                <button
                                  className={styles.stop_edit}
                                  onClick={() => setEditMode(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className={styles.message_info}>
                                {message.text.length && (
                                  <div className={styles.message_text}>
                                    {message.text}
                                  </div>
                                )}
                                {message.image_url && (
                                  <img
                                    className={styles.image}
                                    src={message.img_url}
                                  />
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        <ReactionButton message={message} />
                      </div>
                      <div className={styles.message_actions}>
                        <button
                          className={styles.reactions}
                          onClick={() => toggleReactions(message.id)}
                        >
                          <VscReactions />
                        </button>
                        <div>
                          {showReactions === message.id && (
                            <MessageReactions message={message} />
                          )}
                        </div>
                        {user.id === message.user_id && (
                          <>
                            <button
                              className={styles.edit_button}
                              onClick={() => {
                                setEditMode(message.id);
                                setEditText(message.text);
                              }}
                            >
                              <HiOutlineDocumentText />
                            </button>
                            <OpenModalButton
                              className={styles.delete_button}
                              buttonText={<HiOutlineTrash />}
                              modalComponent={
                                <DeleteMessage
                                  messages={messages}
                                  message={message}
                                  curRoom={curRoom}
                                />
                              }
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </main>
                );
              }
            })}
          </div>
        </div>

        {currChannel && (
          <form
            name="new_message"
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <input
              required
              className={styles.input}
              type="text"
              value={inputText}
              placeholder={`Message # ${currChannel.name}`}
              onChange={(e) => {
                setInputText(e.target.value);
                setErrors({});
              }}
            />
          </form>
        )}
      </div>
    </main>
  );
}

export default MessagesList;
