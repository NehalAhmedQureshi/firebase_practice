"use client";
import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Avatar, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { handleSignOut } from "@/hoc/useSignOut";
import { useRouter } from "next/navigation";

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

function Header(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter()
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  let { user } = useSelector((state) => state.app);
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Facebook Clone
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText
              primaryTypographyProps={{ color: "error" }}
              primary={"Log Out"}
              onClick={()=>{
                handleSignOut()
                router.push('/log-in')
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", marginBottom: "65px" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{background:'rgba(0,0,0,0.5)'}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Stack
            width={"100%"}
            direction="row"
            justifyContent={'space-between'}
            alignItems={"center"}
          >
            <Typography variant="h6" fontWeight={'bold'} component="div">
              Facebook Clone
            </Typography>
            <Stack sx={{ display: { xs: "none", sm: "flex" } }} gap={2} direction={'row'}>
              {navItems.map((item) => (
                <Button variant="text" key={item} sx={{ color: "#fff" }}>
                  {item}
                </Button>
              ))}
            </Stack>

            {user ? (
              <Stack>
                <Avatar src="/sdf/sd" alt="Nehal" />
              </Stack>
            ) : (
              <Stack>
                <Button variant="contained" color="black" sx={{borderRadius:'25px'}}>Sign Up</Button>
              </Stack>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

export default Header;
