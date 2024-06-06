import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------


const ADD_REACTION = 'reactions/ADD_REACTION';
const DELETE_REACTION = 'reactions/REMOVE_REACTION';

//! --------------------------------------------------------------------
//*                         Action Creator
//! --------------------------------------------------------------------

const action = (type, payload) => ({
  type,
  payload,
});

//! --------------------------------------------------------------------
//*                             Thunks
//! --------------------------------------------------------------------


export const addReactionThunk = (message, reactionType) => async (dispatch) => {
    try {
      // console.log(`add reaction: ${reactionType} to message ID: ${message.id}`);

      const response = await fetch(`/api/reactions/${message.id}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ type: reactionType }),
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(action(ADD_REACTION, { message, reaction: data }));
        return data;
      }else {
        const errorData = await response.json();
        console.log(errorData.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  export const deleteReactionThunk = (reaction) => async (dispatch) => {
    try {
      const response = await fetch(`/api/reactions/${reaction.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(action(DELETE_REACTION, data));
      } else {
        const errorData = await response.json();
        console.log(errorData.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

//! --------------------------------------------------------------------
//*                            Selectors
//! --------------------------------------------------------------------




      
//! --------------------------------------------------------------------
//*                            Reducer
//! --------------------------------------------------------------------

const initialState = {
  };
const reactionReducer = (state = initialState, action) => {
  switch (action.type) {


    case ADD_REACTION: {
      const { message, reaction } = action.payload;
      return {
        ...state,
        [message.id]: {
          ...state[message.id],
          [reaction.id]: reaction,
        },
      };
    }

    case DELETE_REACTION: {
      const { messageId, reactionId } = action.payload;
      
    
      // Filter out the specific reaction
      const reactions = { ...state[messageId].reactions };
      delete reactions[reactionId];
    
      // Update message state with filtered reactions
      return {
        ...state,
        [messageId]: {
          ...state[messageId],
          reactions,
        },
      };
    }

      
    default:
      return state;
  }
};

export default reactionReducer;
