import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// ✅ reusable config
const getAuthConfig = () => {
    const token = localStorage.getItem("userToken");
    return {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
};

//Fetch admin products
export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/admin/products`,
                getAuthConfig()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: error.message }
            );
        }
    }
);

//Create product
export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/admin/products`,
                productData,
                getAuthConfig()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: error.message }
            );
        }
    }
);

//Update product
export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/api/admin/products/${id}`,
                productData,
                getAuthConfig()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: error.message }
            );
        }
    }
);

//Delete product
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${API_URL}/api/products/${id}`,
                getAuthConfig()
            );
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: error.message }
            );
        }
    }
);


const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ===== FETCH PRODUCTS =====
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
            })

            // ===== CREATE PRODUCT =====
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
            })

            // ===== UPDATE PRODUCT =====
            .addCase(updateProduct.fulfilled, (state, action) => {
                const updatedProduct = action.payload;

                const index = state.products.findIndex(
                    (product) => product._id === updatedProduct._id
                );

                if (index !== -1) {
                    state.products[index] = updatedProduct;
                }
            })

            // ===== DELETE PRODUCT =====
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (product) => product._id !== action.payload
                );
            });
    }
});

export default adminProductSlice.reducer