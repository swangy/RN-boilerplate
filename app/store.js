import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import userReducer from './slices/userSlice';
// import itemReducer from './slices/symptomsSlice';
// import educationReducer from './slices/educationSlice';

//https://stackoverflow.com/questions/60316251/how-to-use-redux-thunk-with-redux-toolkits-createslice
const store = configureStore({
  reducer: {
    user: userReducer,
    // symptoms: itemReducer, 
    // education: educationReducer 
  },
  middleware: [thunk]
});

export default store
