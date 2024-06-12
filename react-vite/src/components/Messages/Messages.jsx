import { useDispatch, useSelector } from "react-redux";
import styles from "./Messages.module.css";
import {
  createMessageThunk,
  getMessagesArray,
  editMessageThunk,
  getAllMessagesThunk,
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
import { io } from "socket.io-client";

let socket;
const SOCKET_URL = import.meta.env.NODE_ENV === 'production' ? 'https://hypercomm.onrender.com/' : 'http://localhost:8000';

function MessagesList() {
  const dispatch = useDispatch();
  const messages = useSelector(getMessagesArray);
  const currChannel = useSelector((state) => state.channel.current);
  const lastChannel = useSelector((state) => state.channel.last);
  const user = useSelector((state) => state.session.user);
  const allUsers = useSelector((state) => state.session);
  const [inputText, setInputText] = useState("");
  const [errors, setErrors] = useState({});
  const [editText, setEditText] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [showReactions, setShowReactions] = useState(null);
  const scroll = useRef(null);

  useEffect(() => {
    // async () => await
    dispatch(thunkGetAll());
    socket = io(SOCKET_URL);
    socket.on("message", (message) => {
      dispatch(getAllMessagesThunk(message.message["channel_id"]));
    });
  }, []);

  useEffect(() => {
    socket.emit("leave", { room: lastChannel?.id });
    socket.emit("join", { room: currChannel?.id });
  }, [lastChannel, currChannel]);

  useEffect(() => {
    if (messages.length) {
      scroll.current.scrollTop = scroll.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const message = {
      channel_id: currChannel.id,
      text: inputText,
    };

    if (!inputText.trim().length) {
      setErrors({ error: "Message Text Required" });
    } else if (inputText.length > 250) {
      setErrors({ error: "Max length: 250" });
    } else {
      await dispatch(createMessageThunk(currChannel.id, message));
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
      setEditMode(null);
      setEditText("");
      socket.emit("message", { room: currChannel.id, message });
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
              const author = allUsers[message.user_id];
              return (
                <main key={message.id} className={styles.message_body}>
                  <div className={styles.left}>
                    <img
                      className={styles.user_image}
                      src={author?.image_url ? author.image_url : default_user}
                    />
                  </div>
                  <div className={styles.right}>
                    <div className={styles.user_info}>
                      <div className={styles.user_name}>{author?.username}</div>
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
                    </div>
                    <div className={styles.message_actions}>
                      <button
                        className={styles.reactions}
                        onClick={() => toggleReactions(message.id)}
                      >
                        <VscReactions />
                      </button>
                      {showReactions === message.id && (
                        <MessageReactions message={message} />
                      )}
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
                                message={message}
                                socket={socket}
                              />
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                </main>
              );
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
              className={styles.input}
              type="text"
              value={inputText}
              placeholder="Type your message here..."
              onChange={(e) => {
                setInputText(e.target.value);
                setErrors({});
              }}
            />
            <div className={styles.error}>{errors.error && errors.error}</div>
          </form>
        )}
      </div>
    </main>
  );
}

export default MessagesList;
