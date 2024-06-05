import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL_CHANNELS = "channels/GET_ALL_CHANNELS";
const CREATE_CHANNEL = "channels/CREATE_CHANNEL";

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

export const getAllChannelsThunk = (server) => async (dispatch) => {
  try {
    const response = await fetch(`/api/channels/${server.id}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(action(GET_ALL_CHANNELS, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const createChannelThunk = (channel) => async (dispatch) => {
  try {
    const response = await fetch("/api/channels/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(channel),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(action(CREATE_CHANNEL, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------
//*                            Selectors
//! --------------------------------------------------------------------

export const getChannelsArray = createSelector(
  (state) => state.channel,
  (channel) => Object.values(channel)
);

//! --------------------------------------------------------------------
//*                            Reducer
//! --------------------------------------------------------------------

const initialState = {};
const channelReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CHANNELS: {
      const newState = {};
      action.payload.forEach((channel) => (newState[channel.id] = channel));
      return newState;
    }
    case CREATE_CHANNEL: {
      return { ...state, [action.payload.id]: action.payload };
    }
    default:
      return state;
  }
};

export default channelReducer;
