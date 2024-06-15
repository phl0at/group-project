import { useDispatch, useSelector } from "react-redux";
import {
  addReactionThunk,
  deleteReactionThunk,
  getReactionsArray,
} from "../../redux/reactions";

const MessagesReaction = ({ message }) => {
  const dispatch = useDispatch();
  const currChannel = useSelector((state) => state.channel.current);
  const userId = useSelector((state) => state.session.user.id);
  const reactions = useSelector(getReactionsArray);
  const messageReactions = reactions.filter(
    (reaction) => reaction.message_id === message.id
  );
  const userReactions = messageReactions.filter(
    (reaction) => reaction.user_id === userId
  );

  const handleToggleReaction = (type) => {
    const existingReaction = userReactions.find(
      (reaction) => reaction.type === type
    );
    if (existingReaction) {
      dispatch(deleteReactionThunk(existingReaction));
    } else {
      const reaction = {
        type,
        channel_id: currChannel.id,
      };
      dispatch(addReactionThunk(message, reaction));
    }
  };

  return (
    <main>
      <button onClick={() => handleToggleReaction("thumbsup")}>👍</button>
      <button onClick={() => handleToggleReaction("thumbsdown")}>👎</button>
      <button onClick={() => handleToggleReaction("smile")}>😊</button>
    </main>
  );
};

export default MessagesReaction;
