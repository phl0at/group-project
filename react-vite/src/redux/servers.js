import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL = "servers/getAll";
const SET_CURRENT = "servers/setCurrent";
const CLEAR_CURRENT = "servers/clearCurrent";
const CLEAR_ALL = "servers/clearAll";
const CREATE = "servers/create";
const UPDATE = "servers/update";
const DELETE = "servers/delete";

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

export const setCurrentServerThunk = (server) => async (dispatch) => {
  try {
    dispatch(action(SET_CURRENT, server));
    return server;
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const initialLoadThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/servers/init_load");
    if (response.ok) {
      const data = await response.json();
      dispatch(action(GET_ALL, data.servers));
      dispatch(action(SET_CURRENT, data.servers[0]));
      dispatch(action("channels/setCurrent", data.servers[0]));
      dispatch(action("channels/getAll", data.servers[0].channels));
      dispatch(action("messages/getAll", data.servers[0].channels[0].messages));
      return data
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
      dispatch(action(CREATE, data));
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
      dispatch(action(DELETE, server));
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
      dispatch(action(UPDATE, data));
      dispatch(action(SET_CURRENT, data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const clearCurrentServerThunk = () => async (dispatch) => {
  try {
    dispatch(action(CLEAR_CURRENT));
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const clearServersThunk = () => async (dispatch) => {
  try {
    dispatch(action(CLEAR_ALL));
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
    let arr = [];
    for (const key in server) {
      if (Number.isInteger(Number(key))) {
        arr.push(server[key]);
      }
    }
    return arr;
  }
);

//! --------------------------------------------------------------------
//*                            Reducer
//! --------------------------------------------------------------------

const initialState = {};
const serverReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL: {
      const newState = { ...state, current: { ...state["current"] } };
      action.payload.forEach((server) => (newState[server.id] = server));
      return newState;
    }
    case CREATE:
      return { ...state, [action.payload.id]: action.payload };

    case UPDATE: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case SET_CURRENT: {
      return { ...state, current: action.payload };
    }
    case CLEAR_CURRENT: {
      let newState = { ...state };
      delete newState["current"];
      return newState;
    }
    case DELETE: {
      let newState = { ...state };
      delete newState[action.payload.id];
      return newState;
    }
    case CLEAR_ALL: {
      return {};
    }
    default:
      return state;
  }
};

export default serverReducer;
