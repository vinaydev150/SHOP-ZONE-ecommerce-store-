import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ page = 0, size = 10, sortBy = 'createdAt' } = {},
    { rejectWithValue }) => {
    try {
      const response = await API.get(
        `/products?page=${page}&size=${size}&sortBy=${sortBy}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ category, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `/products/category/${category}?page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch'
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/search',
  async ({ keyword, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `/products/search?keyword=${keyword}&page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Search failed'
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/products/categories');
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch categories');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items:            [],
    categories:       [],
    totalPages:       0,
    totalElements:    0,
    currentPage:      0,
    loading:          false,
    error:            null,
    searchKeyword:    '',
    selectedCategory: '',
  },
  reducers: {
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error   = null;
    };
    const handleProductPage = (state, action) => {
      state.loading       = false;
      state.items         = action.payload.content;
      state.totalPages    = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
      state.currentPage   = action.payload.number;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    };

    builder
      .addCase(fetchProducts.pending,             handlePending)
      .addCase(fetchProducts.fulfilled,           handleProductPage)
      .addCase(fetchProducts.rejected,            handleRejected)
      .addCase(fetchProductsByCategory.pending,   handlePending)
      .addCase(fetchProductsByCategory.fulfilled, handleProductPage)
      .addCase(fetchProductsByCategory.rejected,  handleRejected)
      .addCase(searchProducts.pending,            handlePending)
      .addCase(searchProducts.fulfilled,          handleProductPage)
      .addCase(searchProducts.rejected,           handleRejected)
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const {
  setSearchKeyword,
  setSelectedCategory,
} = productSlice.actions;

export default productSlice.reducer;