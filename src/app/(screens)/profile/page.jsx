"use client";
import { useSelector } from "react-redux";
import { Avatar, Box, Button, Divider, Stack, Typography, Paper, IconButton } from "@mui/material";
import { Edit, CameraAlt, Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useSelector((state) => state.app);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/log-in');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ 
      maxWidth: "100%", 
      margin: "0 auto",
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      pt: 3
    }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: 4,
          overflow: 'hidden',
          background: 'white'
        }}
      >
        {/* Cover Photo Section */}
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              height: 300,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              position: 'relative'
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              <CameraAlt />
            </IconButton>
          </Box>
          
          {/* Profile Picture */}
          <Avatar
            src={user?.photoURL}
            alt={user?.name}
            sx={{
              width: 180,
              height: 180,
              border: '5px solid white',
              position: 'absolute',
              bottom: -90,
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                cursor: 'pointer',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              }
            }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
        </Box>

        {/* User Info Section */}
        <Stack 
          alignItems="center" 
          spacing={2}
          sx={{ 
            mt: 12,
            px: 4,
            pb: 4
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {user?.name}
          </Typography>
          <Typography 
            color="text.secondary" 
            variant="subtitle1"
            sx={{ mb: 2 }}
          >
            {user?.email}
          </Typography>

          {/* Social Links */}
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ mb: 3 }}
          >
            <IconButton color="primary"><Facebook /></IconButton>
            <IconButton sx={{ color: '#1DA1F2' }}><Twitter /></IconButton>
            <IconButton sx={{ color: '#0077B5' }}><LinkedIn /></IconButton>
            <IconButton sx={{ color: '#E4405F' }}><Instagram /></IconButton>
          </Stack>

          <Button
            variant="contained"
            startIcon={<Edit />}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
              }
            }}
          >
            Edit Profile
          </Button>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Additional Info */}
        <Box sx={{ px: 4, pb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ mb: 3, color: '#2196F3' }}
          >
            Personal Information
          </Typography>
          <Stack spacing={3}>
            <InfoItem label="First Name" value={user?.firstName} />
            <InfoItem label="Last Name" value={user?.lastName} />
            <InfoItem label="Phone Number" value={user?.phoneNumber} />
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

function InfoItem({ label, value }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: '#f5f7fa',
        '&:hover': {
          backgroundColor: '#eef2f7',
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease'
        }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography 
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {label}
        </Typography>
        <Typography sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Stack>
    </Paper>
  );
} 