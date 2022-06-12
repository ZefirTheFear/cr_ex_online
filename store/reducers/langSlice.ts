import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Language } from "../../models/language";

import ukFlag from "../../assets/flags/uk-flag.png";

interface LanguageState {
  currentLanguage: Language;
}

const initialState: LanguageState = {
  currentLanguage: {
    name: "en",
    img: ukFlag
  }
};

export const languageSlice = createSlice({
  name: "languageState",
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<Language>) => {
      localStorage.setItem("lang", action.payload.name);
      state.currentLanguage = action.payload;
    }
  }
});

export const { setLang } = languageSlice.actions;

export default languageSlice.reducer;
