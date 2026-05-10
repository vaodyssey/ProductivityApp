import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface AppListState {
  selectedPackageName: string | null;
}

const initialState: AppListState = {
  selectedPackageName: null,
};

const appListSlice = createSlice({
  name: "appList",
  initialState,
  reducers: {
    setSelectedPackageName: (state, action: PayloadAction<string>) => {
      state.selectedPackageName = action.payload;
    },
    clearSelection: (state) => {
      state.selectedPackageName = null;
    },
  },
});

export const { setSelectedPackageName, clearSelection } = appListSlice.actions;
export const selectSelectedPackageName = (state: RootState): string | null =>
  state.appList.selectedPackageName;
export default appListSlice.reducer;
