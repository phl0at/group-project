import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL_CHANNELS = "channels/GET_ALL_CHANNELS";

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
      const channels = await response.json()
      dispatch(action(GET_ALL_CHANNELS, channels));
      return channels
    }
  } catch (e) {
    console.log(e)
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
    case GET_ALL_CHANNELS:
      const newState = {};
      action.payload.forEach((channel) => (newState[channel.id] = channel));
      return newState;
    default:
      return state;
  }
};

export default channelReducer;
