import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------


const GET_ALL_SERVERS = "servers/GET_ALL_SERVERS";
const GET_SERVER_ID = "servers/GET_SERVER_ID";
const CREATE_SERVER = "server/CREATE_SERVER";
const SELECT_SERVER = "servers/SELECT_SERVER";
const DELETE_SERVER = "servers/DELETE_SERVER";
const UPDATE_SERVER = 'server/UPDATE_SERVER';


//! --------------------------------------------------------------------
//*                         Action Creator
//! --------------------------------------------------------------------


const updateServer = (server) => ({
    type: UPDATE_SERVER,
    payload: server
});

const createServer = (server) => ({
  type: CREATE_SERVER,
  payload: server,
});

const getAllServers = (servers) => ({
  type: GET_ALL_SERVERS,
  payload: servers,
});

const getServerId = (server) => ({
  type: GET_SERVER_ID,
  payload: server,
});

export const selectServer = (serverId) => ({
  type: SELECT_SERVER,
  payload: serverId,
});

const deleteServer = (payload) => ({
  type: DELETE_SERVER,
  payload
})

// const action = (type, payload) => ({
//   type,
//   payload
// })

//! --------------------------------------------------------------------
//*                             Thunks
//! --------------------------------------------------------------------

export const getServerIdThunk = (serverId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/servers/${serverId}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(getServerId(data));
    }
  } catch (error) {
    dispatch(
      getServerId({ server: "Something went wrong. Please try again", error })
    );
  }
};

//! --------------------------------------------------------------------

export const getAllServersThunk = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/servers/");
    if (response.ok) {
      const data = await response.json();

      if (data.errors) {
        return;
      }

      dispatch(getAllServers(data));
    }
  } catch (error) {
    dispatch(
      getAllServers({ server: "Something went wrong. Please try again", error })
    );
  }
};

//! --------------------------------------------------------------------

export const createServerThunk = (server) => async (dispatch) => {
  const response = await fetch("/api/servers/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(server),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(createServer(data));
    return data;
  } else {
    return { errors: "Something went wrong. Please try again" };
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
      dispatch(deleteServer(server));
    }
  } catch (e) {
    const err = await e.json();
    return err ? err : e;
  }
};

//! --------------------------------------------------------------------
//*                            Selectors
//! --------------------------------------------------------------------

export const getServersArray = createSelector(
  (state) => state.server,
  (server) => Object.values(server)
);

//! --------------------------------------------------------------------
//*                            Reducer
//! --------------------------------------------------------------------

export const updateServerThunk = (server) => async (dispatch) => {
    const response = await fetch(`/api/servers/${server.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: server.name })
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(updateServer(data));
        return data;
    } else {
        const errorData = await response.json();
        return { errors: errorData };
    }
}

const initialState = {};
const serverReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SERVERS: {
            return { ...state, servers: action.payload };
        }
        case GET_SERVER_ID: {
            return { ...state, [action.payload.id]: action.payload }
        }
        case CREATE_SERVER:
            return { ...state, servers: [...state.servers, action.payload] }

        case UPDATE_SERVER: {
            const updatedServers = state.servers.map((server) =>
                server.id === action.payload.id ? action.payload : server
            );
            return { ...state, servers: updatedServers };
        }

        case SELECT_SERVER: {
            return {
                ...state,
                selectedServer: action.payload,
            };
        }





    case SELECT_SERVER: {
      return {
        ...state,
        selectedServer: action.payload,
      };
    }
    case DELETE_SERVER: {
      const newState = { ...state };

      for(let i = 0; i < newState.servers.length; i++){
        if(newState.servers[i].id === action.payload.id){
          newState.servers.splice(i, 1)
        }
      }
      // delete newState[action.payload.id];
      return newState;
    }

    default:
      return state;
  }
};

export default serverReducer;
