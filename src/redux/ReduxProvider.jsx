'use client'
import { AppProvider } from "@/hoc/AppProvider";
import { store } from "./store";
import { Provider } from "react-redux";
import { useRef } from "react";

export default function ReduxProvider({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      <AppProvider>{children}</AppProvider>
    </Provider>
  );
}
