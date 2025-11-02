import { useThemeContext } from "@/theme/ThemeContext";
import { IoMenu, IoNotifications } from "react-icons/io5";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTranslation } from "@/providers/translation";
import SideMenu from "./Sidebar";
import LogOutDialog from "@/components/action-item/LogOutDialog";
import { useRouter } from "next/navigation";
import { removeLocalStorageToken } from "@/auth/localStorageToken";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { t } = useTranslation("common");
  const { mode, toggleColorMode } = useThemeContext();
  const menuAppbar = React.useId();
  const router = useRouter();

  const handleToggleDrawer = () => setOpen(!open);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleLogout = () => setLogoutDialogOpen(true);
  const handleLogoutConfirm = () => {
    router.push("/");
    setLogoutDialogOpen(false);
    removeLocalStorageToken();
  };
  const handleLogoutCancel = () => setLogoutDialogOpen(false);

  const getColor = (light: string, dark: string) =>
    mode === "light" ? `var(${light})` : `var(${dark})`;

  const getHoverStyle = () => ({
    bgcolor: mode === "light" ? "#c77700ff" : "var(--color-hover-black)",
    color: mode === "light" ? "var(--color-black)" : "var(--color-yellow)",
  });

  return (
    <React.Fragment>
      <AppBar
        position="fixed" 
        sx={{
          bgcolor: getColor("--color-yellow", "--color-charcoal"),
          color: getColor("--color-black", "--color-yellow"),
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ pr: "24px", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box display={{xs:"flex" , lg:"none"}}>
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={handleToggleDrawer}
                sx={{
                  marginRight: "36px",
                  bgcolor: getColor("--color-charcoal", "--color-yellow"),
                  color: getColor("--color-yellow", "--color-black"),
                  "&:hover": getHoverStyle(),
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
              >
                <IoMenu size={24} />
              </IconButton>
            </Box>
            <Link href={"/base-info/dashboard"}>
              <Button
                sx={{
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                  fontSize: "1.5rem",
                  color: getColor("--color-black", "--color-yellow"),
                }}
              >
                {t("common", "marketplace-name")}
              </Button>
            </Link>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Tooltip title={t("common", "notifications")}>
              <IconButton
                size="large"
                aria-label="notifications"
                sx={{
                  bgcolor: getColor("--color-charcoal", "--color-yellow"),
                  color: getColor("--color-yellow", "--color-black"),
                  "&:hover": getHoverStyle(),
                  borderRadius: "20px",
                  p: 1,
                  transition: "all 0.3s ease",
                }}
              >
                <Badge color="error">
                  <IoNotifications size={24} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip
              title={
                mode === "light"
                  ? t("common", "switch-to-dark")
                  : t("common", "switch-to-light")
              }
            >
              <IconButton
                onClick={toggleColorMode}
                sx={{
                  bgcolor: getColor("--color-charcoal", "--color-yellow"),
                  color: getColor("--color-yellow", "--color-black"),
                  "&:hover": getHoverStyle(),
                  borderRadius: "20px",
                  p: 1.25,
                  transition: "all 0.3s ease",
                }}
              >
                {mode === "light" ? (
                  <MdDarkMode size={20} />
                ) : (
                  <MdLightMode size={20} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title={t("common", "settings")}>
              <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                <PersonIcon
                  sx={{
                    bgcolor: getColor("--color-charcoal", "--color-yellow"),
                    color: getColor("--color-yellow", "--color-black"),
                    "&:hover": getHoverStyle(),
                    width: 40,
                    height: 40,
                    transition: "all 0.3s ease",
                    borderRadius: "30px",
                    fontSize: "10px",
                  }}
                />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{
                mt: "45px",
                "& .MuiPaper-root": {
                  bgcolor: getColor("--color-charcoal", "--color-yellow"),
                  color: getColor("--color-yellow", "--color-black"),
                  minWidth: 180,
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                },
              }}
              id={menuAppbar}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                onClick={handleLogout}
                sx={{
                  "&:hover": getHoverStyle(),
                  padding: "12px 16px",
                  transition: "all 0.2s ease",
                }}
              >
                <Typography color={getColor("--color-yellow", "--color-black")}>
                  {t("common", "logout")}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <LogOutDialog
        open={logoutDialogOpen}
        handleLogoutConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        title={t("common", "logout")}
        message={t("common", "are-you-sure-logout")}
      />

      <SideMenu open={open} onCloseDrawer={handleToggleDrawer} />
    </React.Fragment>
  );
}
