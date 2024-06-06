import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReactionThunk, deleteReactionThunk } from '../../redux/reactions';


const MessagesReaction = ({ message }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.session.user.id);
  const messageReactions =  useSelector((state)=> state.message[message.id].reactions);


  const userReactions = messageReactions.filter(reaction => reaction.user_id == userId)


  const handleToggleReaction = async (reactionType) => {
    const existingReaction = userReactions.find((reaction) => reaction.type === reactionType);
    
    if (existingReaction) {
      const success = await dispatch(deleteReactionThunk(existingReaction));
     
    } else {
      const newReaction = await dispatch(addReactionThunk(message, reactionType));
  
    }
  };

  return (
    <div>
      <div>
        {userReactions.map((reaction) => (
          <div key={reaction.id}>
            <span>{reaction.type}</span>
            <button onClick={() => handleToggleReaction(reaction.type)}>Delete</button>
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
