import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Fetch all users (admin only) (1)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (__, { rejectWithValue }) => {

    try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
            {
                headers: token ? {
                    Authorization: `Bearer ${token}`
                } : {}
            })
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data || { message: error.message }
        )
    }
})

//Add the user
export const addUser = createAsyncThunk("admin/addUser", async (userData, { rejectWithValue }) => {

    try {
        const token = localStorage.getItem("userToken");
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, userData, {
            headers: token ? {
                Authorization: `Bearer ${token}`
            } : {}
        })
        return response.data.user
    } catch (error) {
        return rejectWithValue(
            error.response?.data || { message: error.message }
        )
    }
})

//Update user info
export const updateUser = createAsyncThunk("admin/updateUser", async ({ id, name, email, role }, { rejectWithValue }) => {

    try {
        const token = localStorage.getItem("userToken");
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, { name, email, role },
            {
                headers: token ? {
                    Authorization: `Bearer ${token}`
                } : {}
            })
        return response.data.user
    } catch (error) {
        return rejectWithValue(
            error.response?.data || { message: error.message }
        )
    }


})

//Delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {

    try {
        const token = localStorage.getItem("userToken");
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {
            headers: token ? {
                Authorization: `Bearer ${token}`
            } : {}
        })
        return id
    } catch (error) {
        return rejectWithValue(
            error.response?.data || { message: error.message }
        )
    }
})

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "Something went wrong"

            }).addCase(addUser.pending, (state) => {
                state.loading = true
                state.error = null
            }).addCase(addUser.fulfilled, (state, action) => {
                state.loading = false
                state.users.push(action.payload) // add a new user to the state
            }).addCase(addUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "User not added"
            }).addCase(updateUser.pending, (state) => {
                state.loading = true;
            }).addCase(updateUser.fulfilled, (state, action) => {
                /*The changes we made on database should be updated in our state */
                state.loading = false;
                const updatedUser = action.payload
                const userIndex = state.users.findIndex((user) => user._id === updatedUser._id)
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser
                }
            }).addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Update failed";
            }).addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;

                state.users = state.users.filter(
                    (user) => user._id !== action.payload
                );
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Delete failed";
            });

    }
})


export default adminSlice.reducer