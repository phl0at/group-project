import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL = "reactions/getAll";
const CREATE = "reactions/create";
const DELETE = "reactions/delete";

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

export const getAllReactionsThunk = (channelId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reactions/${channelId}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(action(GET_ALL, data.reactions));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const addReactionThunk = (message, reaction) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reactions/${message.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reaction),
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(action(CREATE, data));
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
      dispatch(action(DELETE, { id: reaction.id }));
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
    case GET_ALL: {
      const newState = { ...state };
      action.payload.forEach((reaction) => (newState[reaction.id] = reaction));
      return newState;
    }
    case CREATE: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case DELETE: {
      let newState = { ...state };
      delete newState[action.payload.id];
      return newState;
    }
    default:
      return state;
  }
};

export default reactionReducer;
