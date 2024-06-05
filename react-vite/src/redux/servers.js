import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL_SERVERS = "servers/GET_ALL";
const GET_SERVER_ID = "servers/GET_SERVER_ID";
const CREATE_SERVER = "servers/CREATE";
const DELETE_SERVER = "servers/DELETE";
const UPDATE_SERVER = "server/UPDATE";

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

export const getServerIdThunk = (server) => async (dispatch) => {
  try {
    const response = await fetch(`/api/servers/${server.id}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(action(GET_SERVER_ID, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const getAllServersThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/servers/");
    if (response.ok) {
      const data = await response.json();
      dispatch(action(GET_ALL_SERVERS, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const createServerThunk = (server) => async (dispatch) => {
  try {
    const response = await fetch("/api/servers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(server),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(action(CREATE_SERVER, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const deleteServerThunk = (server) => async (dispatch) => {
  try {
    const response = await fetch(`/api/servers/${server.id}`, {
      method: "DELETE",
      header: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      dispatch(action(DELETE_SERVER, server));
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const updateServerThunk = (server) => async (dispatch) => {
  try {
    const response = await fetch(`/api/servers/${server.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: server.name }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(action(UPDATE_SERVER, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------
//*                            Selectors
//! --------------------------------------------------------------------

export const getServersArray = createSelector(
  (state) => state.server,
  (server) => {
    let arr = []
    for(const key in server){
        if(Number.isInteger(Number(key))){
          arr.push(server[key])
        }
    }
    return arr
  });

//! --------------------------------------------------------------------
//*                            Reducer
//! --------------------------------------------------------------------

const initialState = {};
const serverReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SERVERS: {
      const newState = {};
      action.payload.forEach((server) => (newState[server.id] = server));
      return newState;
    }
    case GET_SERVER_ID: {
      return { ...state, current: action.payload };
    }
    case CREATE_SERVER:
      return { ...state, [action.payload.id]: action.payload };

    case UPDATE_SERVER: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case DELETE_SERVER: {
      const newState = { ...state };
      delete newState[action.payload.id];
      return newState;
    }
    default:
      return state;
  }
};

export default serverReducer;
