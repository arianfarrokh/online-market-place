"use client";

import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { TiArrowBack } from "react-icons/ti";
import { FaEye, FaEyeSlash, FaDoorOpen } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/providers/translation";
import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { loginUser } from "./graphql";
import { setLocalStorageToken } from "@/auth/localStorageToken";
import { FullWidthTextField } from "@/components";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation("common", "enum", "error", "form");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validationSchema = yup.object({
    username: yup.string().required(t("error", "required-field")),
    password: yup.string().required(t("error", "required-field")),
  });

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerError(null);

      try {
        const result = await loginUser({
          username: values.username,
          password: values.password,
        });

        if (result.success && result.token) {
          // localStorage.setItem("token", result.token);
          setLocalStorageToken(result.token);
          router.push("/base-info/dashboard");
        } else {
          setServerError(result.message || t("error", "invalid-login"));
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setServerError(t("error", "NETWORK_ERROR"));
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundImage: { xs: `url("/images/conts4.png")`, md: "none" },
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Grid
        size={{ xs: 12, md: 3 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            width: { xs: "90%", sm: 400 },
            textAlign: "left",
            position: "relative",
            backgroundColor: {
              xs: "rgba(255, 255, 255, 0.15)",
              md: "var(--color-charcoal)",
            },
            backdropFilter: { xs: "blur(15px)", md: "none" },
            WebkitBackdropFilter: { xs: "blur(15px)", md: "none" },
            color: "var(--color-yellow)",
          }}
        >
          <IconButton
            onClick={() => window.history.back()}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "var(--color-yellow)",
            }}
          >
            <TiArrowBack />
          </IconButton>

          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: { xs: "1.1rem", md: "1.5rem" },
              color: "var(--color-yellow)",
            }}
          >
            {t("form", "login-to-user")}
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.5, md: 2 },
              mt: 2,
            }}
          >
            <FullWidthTextField
              label="نام کاربری"
              name="username"
             formik={formik}
              fullWidth
              autoComplete="off"
              sx={{
                "& label": { color: "var(--color-yellow)" },
                input: { color: "var(--color-yellow)" },
              }}
            />

            <FullWidthTextField
              label="کلمه عبور"
              name="password"
              type={showPassword ? "text" : "password"}
            formik={formik}
              fullWidth
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        sx={{ color: "var(--color-yellow)" }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& label": { color: "var(--color-yellow)" },
                input: { color: "var(--color-yellow)" },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: 2,
                backgroundColor: "#A86602FF",
                mt: { xs: 2, md: 3 },
                py: { xs: 1, md: 1.2 },
                fontSize: { xs: "0.85rem", md: "1rem" },
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
                overflow: "hidden",
                "&:hover": { backgroundColor: "var(--color-yellow)" },
              }}
            >
              <Box
                className="icon-hover"
                sx={{
                  width: "0",
                  height: "20px",
                  overflow: "hidden",
                  transition: ".3s",
                }}
              >
                <FaDoorOpen
                  style={{
                    fontSize: "17px",
                    textAlign: "center",
                    transform: "translateX(5px)",
                    transition: "all 0.5s ease",
                    color: "white",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  transform: "translateX(-5px)",
                }}
              >
                {t("common", "enter")}
              </Typography>
            </Button>
          </Box>
        </Paper>
      </Grid>

      <Grid
        size={{ xs: 0, md: 9 }}
        sx={{
          backgroundImage: `url("/images/conts4.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
        }}
      />
    </Grid>
  );
}
