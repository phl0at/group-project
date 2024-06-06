import {useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReactionsThunk, addReactionThunk, deleteReactionThunk, getReactionsArray } from '../../redux/reactions';


const MessagesReaction = ({ message }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.session.user.id);
  const reactions = useSelector(getReactionsArray);
  const messageReactions = reactions.filter((reaction) => reaction.message_id === message.id);
  const userReactions = messageReactions.filter((reaction) => reaction.user_id === userId);

  useEffect(() => {
    dispatch(getAllReactionsThunk());
  }, [dispatch]);


  const handleToggleReaction = async (reactionType) => {
    const existingReaction = userReactions.find((reaction) => reaction.type === reactionType);

    if (existingReaction) {
      await dispatch(deleteReactionThunk(existingReaction));
    } else {
      // If the user has any reaction on the message, remove it before adding a new one
      if (userReactions.length > 0) {
        await dispatch(deleteReactionThunk(userReactions[0]));
      }
      await dispatch(addReactionThunk(message, reactionType));
    }
  };

  return (
    <div>
      <div>
        {userReactions.map((reaction) => (
          <div key={reaction.id}>
            <span>{reaction.type}</span>
            <button onClick={() => handleToggleReaction(reaction.type)}></button>
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => handleToggleReaction('👍')}>👍</button>
        <button onClick={() => handleToggleReaction('👎')}>👎</button>
        <button onClick={() => handleToggleReaction('😊')}>😊</button>
      </div>
    </div>
  );
};


export default MessagesReaction;
