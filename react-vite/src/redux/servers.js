import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL = "servers/getAll";
const SET_CURRENT = "servers/setCurrent";
const CLEAR_CURRENT = "servers/clearCurrent";
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
      const { servers, first_server, channels, messages } = data;
      dispatch(action(GET_ALL, servers));
      dispatch(action(SET_CURRENT, first_server));
      dispatch(action("channels/getAll", channels));
      dispatch(action("channels/setCurrent", channels[0]));
      dispatch(action("channels/setLast", channels[0]));
      dispatch(action("messages/getAll", messages));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------

export const createServerThunk = (formData) => async (dispatch) => {
  try {
    const response = await fetch("/api/servers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(action("messages/clearCurrent"));
      dispatch(action(CREATE, data));
      dispatch(action(SET_CURRENT, data));
      dispatch(action("channels/getAll", data.channels));
      dispatch(action("channels/setCurrent", data.channels[0]));
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

export const updateServerThunk = ({ id, formData }) => async (dispatch) => {
  try {
    const response = await fetch(`/api/servers/${seid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: formData,
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
    default:
      return state;
  }
};

export default serverReducer;
