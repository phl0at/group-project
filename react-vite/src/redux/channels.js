import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL_CHANNELS = "channels/GET_ALL";
const SET_CURRENT_CHANNEL = "channels/SET_CURRENT";

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

export const setCurrentChannelThunk = (channel) => async (dispatch) => {
  try {
    dispatch(action(SET_CURRENT_CHANNEL, channel));
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
    case GET_ALL_CHANNELS: {
      const newState = {};
      action.payload.forEach((channel) => (newState[channel.id] = channel));
      return newState;
    }
    case SET_CURRENT_CHANNEL: {
      return { ...state, current: action.payload };
    }
    default:
      return state;
  }
};

export default channelReducer;
