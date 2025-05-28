import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: []
    },
    reducers: {
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;