import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const GET_ALL = "session/getAll";
const UPDATE = "session/update";

//! --------------------------------------------------------------------
//*                         Action Creator
//! --------------------------------------------------------------------

const action = (type, payload) => ({
  type,
  payload,
});

//! --------------------------------------------------------------------

export const editUserThunk = (formData, userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(action(UPDATE, data));
      console.log(data);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------
//*                             Thunks
//! --------------------------------------------------------------------

export const thunkAuthenticate = () => async (dispatch) => {
  const response = await fetch("/api/auth/");
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(action(SET_USER, data));
  }
};

//! --------------------------------------------------------------------

export const thunkLogin = (credentials) => async (dispatch) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(action(SET_USER, data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

//! --------------------------------------------------------------------

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(action(SET_USER, data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

//! --------------------------------------------------------------------

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(action(REMOVE_USER));
};

//! --------------------------------------------------------------------

export const thunkGetAll = () => async (dispatch) => {
  try {
    const response = await fetch("/api/users/");
    if (response.ok) {
      const data = await response.json();
      dispatch(action(GET_ALL, data.users));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

//! --------------------------------------------------------------------
//*                            Selectors
//! --------------------------------------------------------------------

export const getUsersArray = createSelector(
  (state) => state.session,
  (user) => {
    let arr = [];
    for (const key in user) {
      if (Number.isInteger(Number(key))) {
        arr.push(user[key]);
      }
    }
    return arr;
  }
);

//! --------------------------------------------------------------------
//*                            Reducer
//! --------------------------------------------------------------------

const initialState = { user: null };
function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL: {
      const newState = { ...state };
      action.payload.forEach(
        (user) =>
          (newState[user.id] = {
            username: user.username,
            image_url: user.image_url,
          })
      );
      return newState;
    }
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case UPDATE: {
      return {
        ...state,
        user: action.payload,
        [action.payload.id]: action.payload,
      };
    }
    default:
      return state;
  }
}

export default sessionReducer;
