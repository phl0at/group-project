import styles from "./MessageReactions.module.css";
import {
  addReactionThunk,
  deleteReactionThunk,
  getReactionsArray,
} from "../../redux/reactions";
import { useDispatch, useSelector } from "react-redux";

export default function ReactionButton({ message, currChannel }) {
  const dispatch = useDispatch();
  const reactions = useSelector(getReactionsArray);
  const user = useSelector((state) => state.session.user);

  let up_display = false;
  let down_display = false;
  let smile_display = false;
  const count = {
    thumbsup: 0,
    thumbsdown: 0,
    smile: 0,
  };

  reactions.map((reaction) => {
    if (reaction.message_id === message.id) {
      if (reaction.type === "thumbsup") {
        up_display = true;
        count.thumbsup++;
      }
      if (reaction.type === "thumbsdown") {
        down_display = true;
        count.thumbsdown++;
      }
      if (reaction.type === "smile") {
        smile_display = true;
        count.smile++;
      }
    }
  });

  const onClick = (e, type) => {
    e.preventDefault();
    const existingReaction = reactions.filter(
      (reaction) =>
        (reaction.message_id === message.id) &
        (reaction.user_id === user.id) &
        (reaction.type === type)
    );
    if (existingReaction.length) {
      dispatch(deleteReactionThunk(existingReaction[0]));
    } else {
      const reaction = {
        message_id: message.id,
        channel_id: currChannel.id,
        user_id: user.id,
        type,
      };
      dispatch(addReactionThunk(message, reaction));
    }
  };

  return (
    <main className={styles.reaction_list}>
      <div
        id={styles.reaction_button}
        className={up_display ? styles.display : styles.hide}
      >
        <button
          onClick={(e) => {
            onClick(e, "thumbsup");
          }}
        >
          👍
          {count.thumbsup > 0 && count.thumbsup}
        </button>
      </div>
      <div
        id={styles.reaction_button}
        className={down_display ? styles.display : styles.hide}
      >
        <button
          onClick={(e) => {
            onClick(e, "thumbsdown");
          }}
        >
          👎
          {count.thumbsdown > 0 && count.thumbsdown}
        </button>
      </div>
      <div
        id={styles.reaction_button}
        className={smile_display ? styles.display : styles.hide}
      >
        <button
          onClick={(e) => {
            onClick(e, "smile");
          }}
        >
          😊
          {count.smile > 0 && count.smile}
        </button>
      </div>
    </main>
  );
}
