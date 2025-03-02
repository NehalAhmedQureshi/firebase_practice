import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { deleteCookie } from "./cookies/cookies";

const handleSignOut = () => {
  try {
    let result = signOut(auth);
    deleteCookie();
    return result;
  } catch (error) {
    console.log("🚀 ~ handleSignOut ~ error:", error);
    return error;
  }
};

export { handleSignOut };
