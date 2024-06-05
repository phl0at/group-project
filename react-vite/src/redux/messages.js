import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL_MESSAGES = "messages/GET_ALL";
const CLEAR_CURRENT = "messages/CLEAR_CURRENT";

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

export const getAllMessagesThunk = (channel) => async (dispatch) => {
  try {
    const response = await fetch(`/api/channels/${channel.id}/messages`);
    if (response.ok) {
      const data = await response.json();
      dispatch(action(GET_ALL_MESSAGES, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const clearCurrentMessagesThunk = () => async (dispatch) => {
  try {
    dispatch(action(CLEAR_CURRENT))
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------
//*                            Selectors
//! --------------------------------------------------------------------

export const getMessagesArray = createSelector(
  (state) => state.message,
  (message) => Object.values(message)
);

//! --------------------------------------------------------------------
//*                            Reducer
//! --------------------------------------------------------------------

const initialState = {};
const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_MESSAGES: {
      const newState = {};
      action.payload.forEach((message) => (newState[message.id] = message));
      return newState;
    }
    case CLEAR_CURRENT: {
      return {}
    }
    default:
      return state;
  }
};

export default messageReducer;
