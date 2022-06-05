import { createSlice } from "@reduxjs/toolkit";
// import type { RootState } from "../store";

interface MobileMenuState {
  isOpen: boolean;
}

const initialState: MobileMenuState = {
  isOpen: false
};

export const mobileMenuSlice = createSlice({
  name: "mobileMenuState",
  initialState,
  reducers: {
    closeMobileMenu: (state) => {
      state.isOpen = false;
    },
    toggleMobileMenu: (state) => {
      state.isOpen = !state.isOpen;
    }
  }
});

export const { closeMobileMenu, toggleMobileMenu } = mobileMenuSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const mobileMenu = (state: RootState) => state.mobileMenuState.isOpen;

export default mobileMenuSlice.reducer;
