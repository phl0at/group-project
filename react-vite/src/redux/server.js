const CREATE_SERVER = 'server/createServer'

const createServer = (server) => ({
    type: CREATE_SERVER,
    payload: server
});

export const thunkCreateServer = (server) => async (dispatch) => {
    const response = await fetch('/api/servers', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(server)
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createServer(data))
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}

const initialState = {};

const serverReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SERVER:
            return { ...state, [action.payload.id]: action.payload }
        default:
            return state;
    }
}

export default serverReducer
