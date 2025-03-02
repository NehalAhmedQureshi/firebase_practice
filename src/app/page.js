"use client";
import { auth, db } from "@/utils/firebase";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/component/Header";
import { Typography } from "@mui/material";
export default function TestFirebase() {
  useEffect(() => {
    async function checkFirebase() {
      try {
        const testRef = doc(db, "test", "check");
        const docSnap = await getDoc(testRef);

        if (docSnap.exists()) {
          console.log("Firestore is connected ✅", docSnap.data());
        } else {
          console.log("Firestore is connected ✅ but no data found");
        }
      } catch (error) {
        console.error("Firebase error:", error);
      }
    }

    checkFirebase();
  }, []);

  return (
    <>
      <Header />
      <Typography variant="h4" fontFamily={'serif'} fontWeight={'bold'} textAlign={'center'} my={4}>Post</Typography>
    </>
  );
}
