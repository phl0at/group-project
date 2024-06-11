import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
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

function MessagesList() {
  const channel = useSelector((state) => state.channel.current);
  const messages = useSelector(getMessagesArray);
  const user = useSelector((state) => state.session.user);
  const allUsers = useSelector((state) => state.session);
  const [inputText, setInputText] = useState('');
  const [errors, setErrors] = useState({});
  const [editText, setEditText] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [showReactions, setShowReactions] = useState(null);
  const dispatch = useDispatch();
  const scroll = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    dispatch(thunkGetAll());
  }, [dispatch]);

  useEffect(() => {
    if (errors.length) {
      setErrors(errors);
      setInputText('');
    }
  }, [dispatch, errors]);

  useEffect(() => {
    if (messages.length) {
      scroll.current.scrollTop = scroll.current.scrollHeight;
    }

  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const message = {
      channel_id: channel.id,
      text: inputText,
    };

    if (!inputText.trim().length) {
      setErrors({ error: 'Message Text Required' });
    } else if (inputText.length > 250) {
      setErrors({ error: 'Max length: 250' });
    } else {
      await dispatch(createMessageThunk(channel, message));
      setInputText("");
    }
  };

  const handleEditSubmit = async (message) => {
    if (!editText.trim().length) {
      setErrors({ error: 'Message Text Required' });
    } else if (editText.length > 250) {
      setErrors({ error: 'Max length: 250' });
    } else {
      await dispatch(editMessageThunk({ id: message.id, text: editText }));
      setEditMode(null);
      setEditText('');
      socket.current.emit('chat', { room: channel.id, message });
    }
  };

  const toggleReactions = (messageId) => {
    setShowReactions((prev) => (prev === messageId ? null : messageId));
  };

  if (!channel) {
    console.log('Channel is undefined');
    return null; // Or handle the case when channel is not available
  }


  return (
    <main className={styles.main}>
      <div className={styles.channel}>{channel && channel.name}</div>
      <div className={styles.body}>
        <div ref={scroll} className={styles.scroll}>
          <div className={styles.message_list}>
            {messages.length > 0 ? (
              messages.map((message) => {
                const author = allUsers[message.user_id];
                return (
                  <main key={message.id} className={styles.message_body}>
                    <div className={styles.left}>
                      <img
                        className={styles.user_image}
                        src={author.image_url ? author.image_url : default_user}
                      />
                    </div>
                    <div className={styles.right}>
                      <div className={styles.user_info}>
                        <div className={styles.user_name}>
                          {author.username}
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
                                <DeleteMessage message={message} />
                              }
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </main>
                );
              })
            ) : (
              <h3 className={styles.no_messages}>Sure is quiet in here...</h3>
            )}
          </div>
        </div>

        {channel && (
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
            <div className={styles.error}>{errors.error && errors.error}</div>
          </form>
        )}
      </div>
    </main>
  );
}

export default MessagesList;
