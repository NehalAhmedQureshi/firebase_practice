"use client";
import { createCookie } from "@/hoc/cookies/cookies";
import { auth, db, provider } from "@/utils/firebase";
import { Login } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);

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
      console.log("🚀 ~ signIn ~ docSnap:", docSnap)
      // Set user data in Firestore
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber || "N/A",
        uid: user.uid,
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
        createdAt: new Date(), // Add a timestamp for tracking
      });

      // Store access token in localStorage
      localStorage.setItem("access_token", JSON.stringify(user.accessToken));
      createCookie({ value: JSON.stringify(user) });
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>Hello Facebook Clone {loading && 'loading...'}</div>
      <Button
        endDecorator={<Login />}
        onClick={signIn}
        variant="soft"
        color="neutral"
      >
        Sign In With Google
      </Button>
    </>
  );
}
