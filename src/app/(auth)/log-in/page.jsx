"use client";
import { createCookie } from "@/hoc/cookies/cookies";
import { setUser } from "@/redux/slices/appSlice";
import { auth, db, provider } from "@/utils/firebase";
import { Google, Login, Email, Lock, Facebook, GitHub } from "@mui/icons-material";
import { Box, Stack, TextField, Typography, IconButton, Paper, InputAdornment, Alert, Fade } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleEmailAuth(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
      await handleAuthSuccess(userCredential.user);
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      setError("");
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      await handleAuthSuccess(result.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAuthSuccess(user) {
    if (!user) {
      setError("Authentication failed");
      return;
    }

    const userProfile = {
      name: user.displayName || user.email?.split('@')[0],
      email: user.email,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber || "N/A",
      uid: user.uid,
      firstName: user.displayName?.split(" ")[0] || user.email?.split('@')[0],
      lastName: user.displayName?.split(" ")[1] || "",
    };

    await setDoc(doc(db, "users", user.uid), userProfile);
    dispatch(setUser(userProfile));
    createCookie({
      value: JSON.stringify({
        user: userProfile,
        access_token: user?.accessToken,
      }),
    });
    router.push("/");
  }

  function getErrorMessage(code) {
    switch (code) {
      case 'auth/email-already-in-use': return 'Email already exists. Please sign in instead.';
      case 'auth/weak-password': return 'Password should be at least 6 characters';
      case 'auth/user-not-found': return 'User not found. Please sign up.';
      case 'auth/wrong-password': return 'Invalid password';
      default: return 'Authentication failed. Please try again.';
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      {/* Left Side - Welcome Section */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            mb: 2,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 100,
              height: 4,
              backgroundColor: 'white',
              borderRadius: 2,
            }
          }}
        >
          Welcome Back
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ maxWidth: 400, mb: 4 }}>
          Connect with friends and share your moments with the world
        </Typography>
        
        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            top: '10%',
            left: '-5%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            bottom: '10%',
            right: '-5%',
          }}
        />
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Paper
          elevation={3}
          component="form"
          onSubmit={handleEmailAuth}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 450,
            width: '100%',
            mx: 'auto',
          }}
        >
          <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Typography>

          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          <Stack spacing={3}>
            <TextField
              fullWidth
              variant="outlined"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              variant="outlined"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
                }
              }}
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </LoadingButton>

            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ '&::before, &::after': { content: '""', flex: 1, borderBottom: '1px solid #ccc' } }}
            >
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="center">
              <IconButton
                onClick={signInWithGoogle}
                disabled={loading}
                sx={{
                  bgcolor: '#DB4437',
                  color: 'white',
                  '&:hover': { bgcolor: '#C53929' },
                }}
              >
                <Google />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: '#4267B2',
                  color: 'white',
                  '&:hover': { bgcolor: '#365899' },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: '#333',
                  color: 'white',
                  '&:hover': { bgcolor: '#24292e' },
                }}
              >
                <GitHub />
              </IconButton>
            </Stack>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
