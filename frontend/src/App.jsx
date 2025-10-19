// src/App.jsx
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/login";


// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }



import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import FinancialTracker from "./pages/FinanancialTracker";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // menu yang dipakai di navbar & drawer
  const menuItems = [
    { text: "Job Tracker", path: "/dashboard" },
    { text: "Financial Tracker", path: "/financial-tracker" },
  ];

  // Drawer untuk mobile
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        My Tracker
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <BrowserRouter>
      {/* Navbar */}
      <AppBar position="static" component="nav">
        <Toolbar>
          {/* Logo / Judul */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Tracker
          </Typography>

          {/* Menu Desktop */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                color="inherit"
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Menu Mobile (Hamburger) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            sx={{ display: { sm: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer untuk mobile */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { sm: "none", xs: "block" } }}
      >
        {drawer}
      </Drawer>

      {/* Routing */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/financial-tracker" element={<FinancialTracker />} />
      </Routes>
    </BrowserRouter>
  );
}


