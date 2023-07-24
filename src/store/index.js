// import { applyMiddleware, compose } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';


//all reducers
const reducers = {
  auth: authSlice,
}

const store = configureStore({
  reducer: reducers,
  // devTools: false
})

export default store;