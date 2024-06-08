import { useDispatch, useSelector } from "react-redux";
import {
  createMessageThunk,
  getMessagesArray,
  editMessageThunk,
} from "../../redux/messages";
import styles from "./Messages.module.css";
import { useEffect, useState } from "react";
import OpenModalButton from "../OpenModalButton/";
import { thunkGetAll } from "../../redux/session";
import default_user from "../../../../images/default_user.jpg";
import MessageReactions from "../Reactions";
import DeleteMessage from "./DeleteMessageModal/";

function MessagesList() {
  const channel = useSelector((state) => state.channel.current);
  const messages = useSelector(getMessagesArray);
  const user = useSelector((state) => state.session.user);
  const allUsers = useSelector((state) => state.session);
  const [inputText, setInputText] = useState("");
  const [errors, setErrors] = useState({});
  const [editText, setEditText] = useState("");
  const [editMode, setEditMode] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkGetAll());
  }, []);

  useEffect(() => {
    if (errors.length) {
      setErrors(errors);
      setInputText("");
    }
  }, [dispatch, errors]);

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

  const handleEditSubmit = async (message) => {
    if (!editText.trim().length) {
      setErrors({ error: "Message Text Required" });
    } else if (editText.length > 250) {
      setErrors({ error: "Max length: 250" });
    } else {
      await dispatch(editMessageThunk({ id: message.id, text: editText }));
      setEditMode(null);
      setEditText("");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.list}>
        {messages.length > 0
          ? messages.map((message) => {
              const author = allUsers[message.user_id];
              if (!author) return "";
              const src = author.image[0]?.img_url
                ? author.image[0].img_url
                : default_user;
              return (
                <main key={message.id} className={styles.messageBody}>
                  <img className={styles.userImage} src={src} />
                  <div>{author.username}</div>
                  {editMode === message.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEditSubmit(message);
                      }}
                    >
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditMode(null)}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className={styles.message}>

                      {message.text.length && message.text}
                      {message.image[0] && <img className={styles.image} src={message.image[0].img_url} alt="messagePic" /> }
                 
                      {user.id === message.user_id && (
                        <>
                          <button
                            onClick={() => {
                              setEditMode(message.id);
                              setEditText(message.text);
                            }}
                          >
                            Edit
                          </button>
                          <OpenModalButton
                            className={styles.delete}
                            buttonText="Delete"
                            modalComponent={<DeleteMessage message={message} />}
                          />
                        </>
                      )}
                    </div>
                  )}
                  <div className="message">
                    <MessageReactions message={message} />
                  </div>
                </main>
              );
            })
          : <h3 className={styles.noMessages}>Sure is quiet in here...</h3>}

        {channel && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.error}>{errors.error && errors.error}</div>
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
              {"Send Message"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default MessagesList;
