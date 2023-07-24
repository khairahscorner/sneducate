/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'
// import axiosInstance from '../../config/axios';

const initialState = {
    isLoading: false,
    isTokenValid: false,
    userType: null
}

// export const validateToken = createAsyncThunk('auth/validateToken', async (_data, thunkAPI) => {
//     try {
//         const res = await axiosInstance.get("/authenticate");
//         return res.data.user?.userType;
//     }
//     catch (error) {
//         return thunkAPI.rejectWithValue(error.response?.data?.message);
//     }
// })

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        tokenValidSuccess: (state, action) => {
            state.userType = action.payload
            state.isTokenValid = true
        },
    },
    extraReducers: (builder) => {
        builder
            // .addCase(validateToken.fulfilled, (state, action) => {
            //     state.userType = action.payload
            //     state.isTokenValid = true
            // })
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.error = action.payload
                }
            )
            .addDefaultCase((_state, _action) => { })
    },
})

// Action creators are generated for each case reducer function
export const { tokenValidSuccess } = authSlice.actions

export default authSlice.reducer
