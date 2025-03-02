"use client";
import { createCookie } from "@/hoc/cookies/cookies";
import { setUser } from "@/redux/slices/appSlice";
import { auth, db, provider } from "@/utils/firebase";
import { Google, Login } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { Stack, TextField, Typography } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";

import { useState } from "react";
import { useDispatch } from "react-redux";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  async function signIn() {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      let user = result?.user;

      if (!user) {
        console.error("No user found!");
        return;
      }

      // Create a document reference
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      // Set user data in Firestore
      const userProfile = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber || "N/A",
        uid: user.uid,
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
      };
      await setDoc(userRef, userProfile);
      dispatch(setUser({...userProfile}));
      // Store access token in localStorage
      createCookie({
        value: JSON.stringify({
          user: userProfile,
          access_token: user?.accessToken,
        }),
      });
      router.push("/");
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack justifyContent={"center"} alignItems={"center"} height={"70vh"}>
      <Stack
        gap={4}
        minWidth={500}
        bgcolor={"rgba(0, 0, 0, 0.2)"}
        borderRadius={2}
        padding={4}
      >
        <Typography
          variant="h4"
          mb={3}
          textAlign={"center"}
          fontFamily={"fantasy"}
          fontWeight={"bold"}
          color="primary"
        >
          Sign In
        </Typography>
        <TextField
          variant="standard"
          name="email"
          type="email"
          placeholder="Enter your email address"
        />
        <TextField
          variant="standard"
          name="password"
          type="password"
          placeholder="Enter your password"
        />
        <Button variant="solid">Sign Up</Button>
        <Button
          endDecorator={<Login />}
          startDecorator={<Google/>}
          onClick={signIn}
          variant="soft"
        >
          Sign In With Google
        </Button>
      </Stack>
    </Stack>
  );
}
