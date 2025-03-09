import Header from "@/component/Header";
import { Box } from "@mui/material";

export default function Layout({ children }) {
  return (
    <Box>
      <Header />
      <Box sx={{ mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}