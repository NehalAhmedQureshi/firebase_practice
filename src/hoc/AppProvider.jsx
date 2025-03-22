"use client";

import { ThemeProvider } from "next-themes"; // Example: Theme management
import { SessionProvider } from "next-auth/react"; // Example: Authentication
import { useEffect, useState } from "react";
import { getCookie } from "./cookies/cookies";
import { usePathname, redirect } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/appSlice";
import Loading from "@/app/loading";
import Header from "@/component/Header";

// List of public routes that don't require authentication
const PUBLIC_ROUTES = ['/log-in'];

export function AppProvider({ children }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        if (PUBLIC_ROUTES.includes(pathname)) {
          setIsLoading(false);
          return;
        }

        const { value } = await getCookie() || {};
        
        if (!value && mounted) {
          redirect("/log-in");
          return;
        }

        const { user } = JSON.parse(value);
        if (!user && mounted) {
          redirect("/log-in");
          return;
        }

        if (mounted) {
          dispatch(setUser(user));
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (mounted) {
          redirect("/log-in");
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, dispatch]);

  if (isLoading && !PUBLIC_ROUTES.includes(pathname)) {
    return <Loading />;
  }

  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <Header />
        {children}
        </ThemeProvider>
    </SessionProvider>
  );
}
