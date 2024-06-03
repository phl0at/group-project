import { csrfFetch } from "./csrf";
const GET_ALL_SERVERS = 'servers/GET_ALL_SERVERS';
const GET_SERVER_ID = 'servers/GET_SERVER_ID'

const getAllServers = (servers) => ({
    type: GET_ALL_SERVERS,
    payload: servers,
})

const getServerId = (server)=> ({
    type: GET_SERVER_ID,
    payload: server 
})


export const getServerIdThunk = (serverId) => async(dispatch)=> {
  
    try {
        const response = await csrfFetch(`/api/servers/${serverId}`);
        if (response.ok) {
          const data = await response.json();
          dispatch(getServerId(data));
        }
      } catch (error) {
        dispatch(getServerId({ server: "Something went wrong. Please try again" , error}));
      }

}


export const getAllServersThunk = () => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/servers/')
        if (response.ok) {
            const data = await response.json()

            if (data.errors) {
                return;
            }

            dispatch(getAllServers(data))
        }
    } catch (error) {
        dispatch(getAllServers({ server: "Something went wrong. Please try again" , error}));
    }
}


const initialState = {}
const serverReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SERVERS: {
            return { ...state, servers: action.payload };
        }

        case GET_SERVER_ID: {
            return {...state, [action.payload.id]: action.payload}
        }
        default:
            return state
    }
}

export default serverReducer
