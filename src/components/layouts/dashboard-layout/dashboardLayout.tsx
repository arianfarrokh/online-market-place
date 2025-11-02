"use client";
import React, { PropsWithChildren } from "react";
import { Box } from "@mui/material";
import DashboardHeader from "./dashboardHeader";

const drawerWidth = 310;

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box minHeight="100vh" position="relative">
      <span id="back-to-top-anchor" />
      <DashboardHeader />

      <Box
        component="main"
        sx={{
          mt: "64px",
          ml: { lg: `${drawerWidth}px` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
