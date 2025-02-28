'use client'
import AppProvider from "@/hoc/AppProvider";
import { store } from "./store";
import { Provider } from "react-redux";

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AppProvider>{children}</AppProvider>
    </Provider>
  );
}
