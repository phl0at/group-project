import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL = "messages/getAll";
const CLEAR = "messages/clearCurrent";
const CREATE = "messages/create";
const EDIT = "messages/edit";
const DELETE = "messages/delete";

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

export const getAllMessagesThunk = (channelId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/channels/${channelId}/messages`);
    if (response.ok) {
      const data = await response.json();
      dispatch(action(GET_ALL, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};


//! --------------------------------------------------------------------

export const editMessageThunk = (message) => async (dispatch) => {
  try {
    const response = await fetch(`/api/messages/${message.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message.text }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(action(EDIT, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};


//! --------------------------------------------------------------------

export const clearCurrentMessagesThunk = () => async (dispatch) => {
  try {
    dispatch(action(CLEAR));
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const createMessageThunk = (channelId, message) => async (dispatch) => {
  try {
    const response = await fetch(`/api/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(action(CREATE, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const deleteMessageThunk = (message) => async (dispatch) => {
  try {
    const response = await fetch(`/api/messages/${message.id}`, {
      method: "DELETE",
      header: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      dispatch(action(DELETE, message));
      return response;
    }
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
    case GET_ALL: {
      const newState = {};
      action.payload.forEach((message) => (newState[message.id] = message));
      return newState;
    }
    case CREATE: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case EDIT: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case DELETE: {
      let newState = { ...state };
      delete newState[action.payload.id];
      return newState;
    }
    case CLEAR: {
      return {};
    }
    default:
      return state;
  }
};

export default messageReducer;
