import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL_REACTIONS = "reactions/GET_ALL";
const ADD_REACTION = "reactions/ADD_REACTION";
const DELETE_REACTION = "reactions/REMOVE_REACTION";

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

export const getAllReactionsThunk = () => async (dispatch) => {
  try {
    const response = await fetch(`/api/reactions/`);
    if (response.ok) {
      const data = await response.json();
      dispatch(action(GET_ALL_REACTIONS, data.reactions));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const addReactionThunk = (message, reactionType) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reactions/${message.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: reactionType }),
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(action(ADD_REACTION, data));
      return data;
    } else {
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
      method: "DELETE",
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(action(DELETE_REACTION, { id: reaction.id }));
      return data;
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

export const getReactionsArray = createSelector(
  (state) => state.reaction,
  (reaction) => Object.values(reaction)
);

//! --------------------------------------------------------------------
//*                            Reducer
//! --------------------------------------------------------------------

const initialState = {};
const reactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_REACTIONS: {
      const newState = { ...state };
      action.payload.forEach((reaction) => (newState[reaction.id] = reaction));
      return newState;
    }
    case ADD_REACTION: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case DELETE_REACTION: {
      let newState = { ...state };
      delete newState[action.payload.id];
      return newState;
    }
    default:
      return state;
  }
};

export default reactionReducer;
