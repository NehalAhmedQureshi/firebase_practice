"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Avatar, Badge, InputBase, Stack, useScrollTrigger } from "@mui/material";
import {
  Menu as MenuIcon,
  Search,
  Home,
  People,
  Notifications,
  Message,
  Facebook as FacebookIcon,
} from "@mui/icons-material";
import { styled, alpha } from '@mui/material/styles';
import ProfileIcon from "./ProfileIcon";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const SearchI = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const NavButton = styled(IconButton)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : 'inherit',
  borderRadius: 8,
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  '&::after': active && {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '3px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '3px 3px 0 0',
  }
}));

export default function Header() {
  const [activeTab, setActiveTab] = React.useState('home');
  const { user } = useSelector((state) => state.app);
  const router = useRouter();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <Box sx={{ flexGrow: 1, mb: 8 }}>
      <AppBar 
        position="fixed" 
        sx={{
          background: trigger ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          boxShadow: trigger ? 2 : 0,
          color: 'text.primary',
          transition: 'all 0.3s ease',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* Logo Section */}
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <FacebookIcon 
            color="primary" 
            sx={{ 
              fontSize: 40,
              display: { xs: 'none', md: 'block' }
            }} 
          />

          {/* Search Section */}
          <SearchI>
            <SearchIconWrapper>
              <SearchI />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchI>

          {/* Navigation Section */}
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              flexGrow: 1,
              justifyContent: 'center',
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <NavButton 
              active={activeTab === 'home'} 
              onClick={() => setActiveTab('home')}
            >
              <Home />
            </NavButton>
            <NavButton 
              active={activeTab === 'friends'} 
              onClick={() => setActiveTab('friends')}
            >
              <People />
            </NavButton>
          </Stack>

          {/* Actions Section */}
          {user ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton size="large">
                <Badge badgeContent={4} color="error">
                  <Message />
                </Badge>
              </IconButton>
              <IconButton size="large">
                <Badge badgeContent={17} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <ProfileIcon />
            </Stack>
          ) : (
            <Stack>
              <IconButton
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  px: 3,
                  borderRadius: 2,
                }}
                onClick={() => router.push('/log-in')}
              >
                Sign In
              </IconButton>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
