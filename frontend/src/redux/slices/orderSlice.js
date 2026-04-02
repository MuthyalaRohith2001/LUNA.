import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"


//Async Thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders", async (_, { rejectWithValue }) => {

    try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
            {
                headers: token ? {
                    Authorization: `Bearer ${token}`
                } : {}
            })
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data || { message: error.message }
        );
    }
})


//Async Thunk to fetch orders details by ID
export const fetchOrderDetails = createAsyncThunk("orders/fetchOrderDetails", async (orderId, { rejectWithValue }) => {

    try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
            {
                headers: token ? {
                    Authorization: `Bearer ${token}`
                } : {}
            })
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data || { message: error.message }
        );
    }
})

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,/**Stores the details of single order */
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //Fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "Failed to fetch user order"
            })
            //Fetch order details
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false
                state.orderDetails = action.payload
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "Failed to fetch order details"
            })
    }
})


export default orderSlice.reducer
/**we export the reducer to include it in the redux store */