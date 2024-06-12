import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL = "channels/getAll";
const SET_CURRENT = "channels/setCurrent";
const SET_LAST = "channels/setLast"
const CLEAR_CURRENT = "channels/clearCurrent";
const CLEAR_ALL = "channels/clearAll";
const CREATE = "channels/create";
const UPDATE = "channels/update";
const DELETE = "channels/delete";

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

export const updateChannelThunk = (channel) => async (dispatch) => {
  try {
    const response = await fetch(`/api/channels/${channel.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: channel.name }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(action(UPDATE, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const getAllChannelsThunk = (server) => async (dispatch) => {
  try {
    const response = await fetch(`/api/channels/${server.id}`);
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

export const createChannelThunk = (channel) => async (dispatch) => {
  try {
    const response = await fetch("/api/channels/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(channel),
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
export const deleteChannelThunk = (channel, serverId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/channels/${channel.id}`, {
      method: "DELETE",
      header: { "Content-Type": "application/json" },
      body: {
        serverId,
      },
    });

    if (response.ok) {
      const data = await response.json()
      dispatch(action(DELETE, channel));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const setCurrentChannelThunk = (channel) => async (dispatch) => {
  try {
    dispatch(action(SET_CURRENT, channel));
    return channel;
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const setLastChannelThunk = (channel) => async (dispatch) => {
  try {
    dispatch(action(SET_LAST, channel));
    return channel;
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const clearCurrentChannelThunk = () => async (dispatch) => {
  try {
    dispatch(action(CLEAR_CURRENT));
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const clearChannelsThunk = () => async (dispatch) => {
  try {
    dispatch(action(CLEAR_ALL));
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------
//*                            Selectors
//! --------------------------------------------------------------------

export const getChannelsArray = createSelector(
  (state) => state.channel,
  (channel) => {
    let arr = [];
    for (const key in channel) {
      if (Number.isInteger(Number(key))) {
        arr.push(channel[key]);
      }
    }
    return arr;
  }
);

//! --------------------------------------------------------------------
//*                            Reducer
//! --------------------------------------------------------------------

const initialState = {};
const channelReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL: {
      const newState = { current: { ...state["current"] } };
      action.payload.forEach((channel) => (newState[channel.id] = channel));
      return newState;
    }
    case CREATE: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case UPDATE: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case DELETE: {
      let newState = { ...state };
      delete newState[action.payload.id];
      return newState;
    }
    case SET_CURRENT: {
      return { ...state, current: action.payload };
    }
    case SET_LAST:{
      return { ...state, last: action.payload}
    }
    case CLEAR_CURRENT: {
      let newState = { ...state };
      delete newState["current"];
      return newState;
    }
    case CLEAR_ALL: {
      return {};
    }
    default:
      return state;
  }
};

export default channelReducer;
