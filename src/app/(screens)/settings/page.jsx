"use client";
import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Switch,
  Divider,
  Typography,
} from "@mui/material";
import {
  DarkMode,
  Notifications,
  Lock,
  Language,
  Help,
  Info,
} from "@mui/icons-material";
import Header from "@/component/Header";

export default function Page() {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    privacy: true,
    language: "English",
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Settings
        </Typography>

        <List sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
          <SettingsSection title="Preferences">
            <ListItem>
              <ListItemIcon>
                <DarkMode />
              </ListItemIcon>
              <ListItemText primary="Dark Mode" />
              <Switch
                edge="end"
                checked={settings.darkMode}
                onChange={() => handleToggle("darkMode")}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText 
                primary="Notifications" 
                secondary="Enable push notifications"
              />
              <Switch
                edge="end"
                checked={settings.notifications}
                onChange={() => handleToggle("notifications")}
              />
            </ListItem>
          </SettingsSection>

          <SettingsSection title="Privacy">
            <ListItemButton>
              <ListItemIcon>
                <Lock />
              </ListItemIcon>
              <ListItemText 
                primary="Privacy Settings" 
                secondary="Manage your privacy preferences"
              />
            </ListItemButton>
          </SettingsSection>

          <SettingsSection title="General">
            <ListItemButton>
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText 
                primary="Language" 
                secondary="Change your language preferences"
              />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <Help />
              </ListItemIcon>
              <ListItemText primary="Help & Support" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItemButton>
          </SettingsSection>
        </List>
      </Box>
    </>
  );
}

function SettingsSection({ title, children }) {
  return (
    <>
      <ListItem>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </ListItem>
      {children}
      <Divider />
    </>
  );
} 