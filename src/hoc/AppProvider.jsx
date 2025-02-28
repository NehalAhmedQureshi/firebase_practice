"use client";

import { ThemeProvider } from "next-themes"; // Example: Theme management
import { SessionProvider } from "next-auth/react"; // Example: Authentication
import { useEffect } from "react";
import { getCookie } from "./cookies/cookies";
import { redirect } from "next/navigation";
import { store } from "@/redux/store";
import { Provider, useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/appSlice";

export default function AppProvider({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    (async function () {
      let { value } = (await getCookie()) || {};
      console.log("🚀 ~ value:", value);
      if (!value) {
        redirect("/log-in");
      } else {
        let { user } = JSON.parse(value);
        dispatch(setUser({...user}));
      }
    })();
  }, []);
  return (
      <SessionProvider>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </SessionProvider>
  );
}
