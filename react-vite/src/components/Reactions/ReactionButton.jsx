import styles from "./MessageReactions.module.css";
import { getReactionsArray } from "../../redux/reactions";
import { useSelector } from "react-redux";

export default function ReactionButton({ message }) {
  const reactions = useSelector(getReactionsArray);

  return (
    <main
      className={styles.reaction_list}
      //onclick = if user has reaction, delete, else add
    >
      {reactions.map((reaction) => {
        if (reaction.message_id === message.id) {
          switch (reaction.type) {
            case "thumbsup": {
              return (
                <button key={reaction.id} className={styles.reaction}>
                  👍
                </button>
              );
            }
            case "thumbsdown": {
              return (
                <button key={reaction.id} className={styles.reaction}>
                  👎
                </button>
              );
            }
            case "smile": {
              return (
                <button key={reaction.id} className={styles.reaction}>
                  😊
                </button>
              );
            }
          }
        }
      })}
    </main>
  );
}
