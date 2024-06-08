import { createSelector } from "reselect";

//! --------------------------------------------------------------------
//*                          Action Types
//! --------------------------------------------------------------------

const GET_ALL_IMAGE = "image/GET_ALL";
const CREATE_IMAGE = "image/CREATE_IMAGE"
// const UPDATE_USER_IMAGE = "image/UPDATE_IMAGE"



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

export const getAllImageThunk = () => async (dispatch) => {
    try {
      const response = await fetch(`/api/images/`);
      if (response.ok) {
        const data = await response.json();
        dispatch(action(GET_ALL_IMAGE, data));
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }



export const createImageThunk = (formData) => async (dispatch) => {
    try {
      const response = await fetch(`/api/images/new`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(action(CREATE_IMAGE, data));
  
        return data;
      } else {
        const errorData = await response.json();
        console.log(errorData.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  


//! --------------------------------------------------------------------
//*                            Selectors
//! --------------------------------------------------------------------

export const getImageArray = createSelector(
    (state) => state.image,
    (image) => Object.values(image)
  );
  


//! --------------------------------------------------------------------
//*                            Reducer
//! --------------------------------------------------------------------

const initialState = {
  };
const imageReducer = (state = initialState, action) => {
  switch (action.type) {

    case GET_ALL_IMAGE: {
        const newState = {};
        action.payload.forEach((image) => (newState[image.id] = image));
        return newState;
      }
  

   
    case CREATE_IMAGE: {
      return { ...state, [action.payload.id]: action.payload };
    }

    // case DELETE_REACTION: {
    //   let newState = { ...state };
    //   delete newState[action.payload.id];
    //   return newState;
    // }

    default:
      return state;
  }
};

export default imageReducer;
