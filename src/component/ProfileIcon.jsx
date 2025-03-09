import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Divider, IconButton, ListItemIcon, Stack, Typography } from '@mui/material';
import { AccountCircle, Logout, Settings } from '@mui/icons-material';
import { handleSignOut } from '@/hoc/useSignOut';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function ProfileIcon() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();
  const { user } = useSelector((state) => state.app);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await handleSignOut();
    handleClose();
    router.push('/log-in');
  };

  const handleMenuClick = (path) => {
    handleClose();
    router.push(path);
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar 
          src={user?.photoURL} 
          // alt={user?.name}
          sx={{ width: 32, height: 32 }}
        >
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleMenuClick(`/profile`)}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar src={user?.photoURL}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Stack>
              <Typography variant="subtitle2">{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Stack>
          </Stack>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleMenuClick(`/profile`)}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick(`/settings`)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
