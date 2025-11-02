"use client";
import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Grid,
  Box,
  Typography,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
  keyframes,
} from "@mui/material";
import { chartsTooltipClasses, LineChart } from "@mui/x-charts";
import { useThemeContext } from "@/theme/ThemeContext";
import { FcStatistics } from "react-icons/fc";
import { useTranslation } from "@/providers/translation";

export default function DashboardPage() {
  const { mode } = useThemeContext();

  const { t } = useTranslation("common", "form", "enum", "error");

  const theme = useTheme();
  // تشخیص اندازه صفحه نمایش با useMediaQuery
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // تنظیم عرض و ارتفاع به‌صورت پویا
  const chartWidth = isSmallScreen ? 250 : isMediumScreen ? 400 : 400;
  const chartHeight = isSmallScreen ? 200 : isMediumScreen ? 250 : 280;

  const barChartsParams = {
    xAxis: [{ data: ["آهن", "ابزار", "گچ", "سیمان", "سنگ"] }],
    series: [{ data: [55, 30, 22, 11, 25], stack: "1" }],
    hideLegend: false,
    colors: ["#ff9900"],
  };

  const params = {
    xAxis: [{ data: [1, 2, 3, 5, 8, 10] }],
    series: [{ data: [2, 5.5, 2, 8.5, 1.5, 5] }],
    axisHighlight: { x: "line" },
    colors: ["#ff9900"],
  } as const;

  const fadeIn = keyframes`
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    `;

  return (
    <>
      <Box
        bgcolor={mode === "light" ? "#cccccc" : "#393e42ff"}
        sx={{ pb: 10, pt: 5, pr: 5, pl: 5 }}
      >
        <Box
          sx={{
            animation: `${fadeIn} 1s ease-in-out`,
          }}
        >
          {/* عنوان صفحه */}
          <Stack direction={"row"}>
            <FcStatistics color="#b57719" size={40} />
            <Typography
              sx={{
                textShadow:
                  mode === "light" ? "0 0 8px #7a7272b6" : "0 0 8px #ff9900",
              }}
              ml={2}
              fontSize={{
                xs: "1rem",
                sm: "1.2rem",
                md: "1.3rem",
                lg: "1.7rem",
              }}
              fontWeight="bold"
              mb={3}
            >
              {t("form", "General-statistics")}
            </Typography>
          </Stack>

          {/*--------------- ردیف اول ------------*/}
          <Grid container spacing={2}>
            <Grid
              sx={{
                boxShadow:
                  mode === "light" ? "0 0 8px #656870" : "0 0 10px #deffff",
              }}
              size={{ xs: 12, sm: 6, md: 3 }}
            >
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography
                  sx={{
                    textShadow:
                      mode === "light"
                        ? "0 0 8px #7a7272b6"
                        : "0 0 8px #ff9900",
                  }}
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  fontSize={{
                    xs: "1rem",
                    sm: "1.2rem",
                    md: "1.3rem",
                    lg: "1.5rem",
                  }}
                >
                  {t("form", "Estimated-income")}
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  variant="h6"
                >
                  788.000 تومان
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  color={mode === "light" ? "green" : "#09b3a2"}
                  fontSize={"1.2rem"}
                >
                  2%+
                </Typography>
              </Paper>
            </Grid>
            <Grid
              sx={{
                boxShadow:
                  mode === "light" ? "0 0 8px #656870" : "0 0 8px #deffff",
              }}
              size={{ xs: 12, sm: 6, md: 3 }}
            >
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography
                  sx={{
                    textShadow:
                      mode === "light"
                        ? "0 0 8px #7a7272b6"
                        : "0 0 8px #ff9900",
                  }}
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  fontSize={{
                    xs: "1rem",
                    sm: "1.2rem",
                    md: "1.3rem",
                    lg: "1.5rem",
                  }}
                >
                  {t("form", "Orders")}
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  variant="h6"
                >
                  2
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  color={mode === "light" ? "green" : "#09b3a2"}
                  fontSize={"1.2rem"}
                >
                  12%+
                </Typography>
              </Paper>
            </Grid>
            <Grid
              sx={{
                boxShadow:
                  mode === "light" ? "0 0 8px #656870" : "0 0 8px #deffff",
              }}
              size={{ xs: 12, sm: 6, md: 3 }}
            >
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography
                  sx={{
                    textShadow:
                      mode === "light"
                        ? "0 0 8px #7a7272b6"
                        : "0 0 8px #ff9900",
                  }}
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  fontSize={{
                    xs: "1rem",
                    sm: "1.2rem",
                    md: "1.3rem",
                    lg: "1.5rem",
                  }}
                >
                  {t("form", "products")}
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  variant="h6"
                >
                  3
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  color={mode === "light" ? "green" : "#09b3a2"}
                  fontSize={"1.2rem"}
                >
                  3%+
                </Typography>
              </Paper>
            </Grid>
            <Grid
              sx={{
                boxShadow:
                  mode === "light" ? "0 0 8px #656870" : "0 0 8px #deffff",
              }}
              size={{ xs: 12, sm: 6, md: 3 }}
            >
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography
                  sx={{
                    textShadow:
                      mode === "light"
                        ? "0 0 8px #7a7272b6"
                        : "0 0 8px #ff9900",
                  }}
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  fontSize={{
                    xs: "1rem",
                    sm: "1.2rem",
                    md: "1.3rem",
                    lg: "1.5rem",
                  }}
                >
                  {t("form", "users")}
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  variant="h6"
                >
                  3
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  color={mode === "light" ? "green" : "#09b3a2"}
                  fontSize={"1.2rem"}
                >
                  8%+
                </Typography>
              </Paper>
            </Grid>

            {/* -------------- ردیف دوم ------------- */}

            <Grid
              sx={{
                boxShadow:
                  mode === "light" ? "0 0 8px #656870" : "0 0 8px #deffff",
              }}
              size={{ xs: 12, sm: 12, md: 6, lg: 4 }}
            >
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography
                  sx={{
                    textShadow:
                      mode === "light"
                        ? "0 0 8px #7a7272b6"
                        : "0 0 8px #ff9900",
                  }}
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  mb={3}
                  fontSize={{
                    xs: "1rem",
                    sm: "1.2rem",
                    md: "1.3rem",
                    lg: "1.5rem",
                  }}
                >
                  {t("form", "Top-Sellers")}
                </Typography>

                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  mb={1}
                >
                  فروشنده 1 |6.000.000 تومان
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  mb={1}
                >
                  فروشنده 2 | 3.200.000 تومان
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  mb={1}
                >
                  فروشنده 3 | 2.000.000 تومان
                </Typography>
              </Paper>
            </Grid>
            <Grid
              sx={{
                boxShadow:
                  mode === "light" ? "0 0 8px #656870" : "0 0 8px #deffff",
              }}
              size={{ xs: 12, sm: 12, md: 6, lg: 4 }}
            >
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography
                  sx={{
                    textShadow:
                      mode === "light"
                        ? "0 0 8px #7a7272b6"
                        : "0 0 8px #ff9900",
                  }}
                  mb={3}
                  fontSize={{
                    xs: "1rem",
                    sm: "1.2rem",
                    md: "1.3rem",
                    lg: "1.5rem",
                  }}
                >
                  {t("form", "Best-selling-products")}
                </Typography>

                <Stack
                  mt={2}
                  ml={{ xs: 4, sm: 5 }}
                  direction="column"
                  alignItems="center"
                >
                  <Box sx={{ width: "100%", maxWidth: "100vw" }}>
                    <BarChart
                      width={chartWidth}
                      height={chartHeight}
                      {...barChartsParams}
                      slotProps={{ tooltip: { trigger: "axis" } }}
                    />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid
              sx={{
                boxShadow:
                  mode === "light" ? "0 0 8px #656870" : "0 0 8px #deffff",
              }}
              size={{ xs: 12, sm: 12, md: 6, lg: 4 }}
            >
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography
                  sx={{
                    textShadow:
                      mode === "light"
                        ? "0 0 8px #7a7272b6"
                        : "0 0 8px #ff9900",
                  }}
                  mb={3}
                  fontSize={{
                    xs: "1rem",
                    sm: "1.2rem",
                    md: "1.3rem",
                    lg: "1.5rem",
                  }}
                >
                  {t("form", "Monthly-sales-chart")}
                </Typography>

                <LineChart
                  {...params}
                  width={chartWidth}
                  height={chartHeight}
                  sx={{
                    ml: { xs: 4, sm: 5 },
                  }}
                  slotProps={{
                    tooltip: {
                      sx: {
                        [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.valueCell}`]:
                          {
                            color: "red",
                          },
                      },
                    },
                  }}
                />
              </Paper>
            </Grid>

            {/* ---------------- ردیف سوم ---------------  */}

            <Grid
              sx={{
                boxShadow:
                  mode === "light" ? "0 0 8px #656870" : "0 0 8px #deffff",
              }}
              size={{ xs: 12, sm: 12, md: 6, lg: 4 }}
            >
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography
                  sx={{
                    textShadow:
                      mode === "light"
                        ? "0 0 8px #7a7272b6"
                        : "0 0 8px #ff9900",
                  }}
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  mb={2}
                  fontSize={{
                    xs: "1rem",
                    sm: "1.2rem",
                    md: "1.3rem",
                    lg: "1.5rem",
                  }}
                >
                  {t("form", "Returned-goods-rate")}
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  variant="h4"
                  color="red"
                >
                  4.3%
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  color="#999"
                  fontSize={"1rem"}
                >
                  {t("form", "Ratio-of-returned-goods-to-total-orders")}
                </Typography>
              </Paper>
            </Grid>
            <Grid
              sx={{
                boxShadow:
                  mode === "light" ? "0 0 8px #656870" : "0 0 8px #deffff",
              }}
              size={{ xs: 12, sm: 12, md: 6, lg: 4 }}
            >
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography
                  sx={{
                    textShadow:
                      mode === "light"
                        ? "0 0 8px #7a7272b6"
                        : "0 0 8px #ff9900",
                  }}
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  mb={3}
                  fontSize={{
                    xs: "0.9rem",
                    sm: "1.2rem",
                    md: "1.3rem",
                    lg: "1.5rem",
                  }}
                >
                  {t("form", "Inventory-and-order-alerts")}
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  mt={2}
                  fontSize={"1rem"}
                >
                  سفارش های جدید: 27
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  mb={2}
                  fontSize={"1rem"}
                >
                  محصولات در انتظار تایید: 2
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  color="#ff0000be"
                  fontSize={"1rem"}
                >
                  سیمان : موجودی 3
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  color="#ff0000be"
                  fontSize={"1rem"}
                >
                  آهن: موجودی 2
                </Typography>
              </Paper>
            </Grid>
            <Grid
              sx={{
                boxShadow:
                  mode === "light" ? "0 0 8px #656870" : "0 0 8px #deffff",
              }}
              size={{ xs: 12, sm: 12, md: 6, lg: 4 }}
            >
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography
                  sx={{
                    textShadow:
                      mode === "light"
                        ? "0 0 8px #7a7272b6"
                        : "0 0 8px #ff9900",
                  }}
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  mb={3}
                  fontSize={{
                    xs: "1rem",
                    sm: "1.2rem",
                    md: "1.3rem",
                    lg: "1.5rem",
                  }}
                >
                  {t("form", "Buyer-satisfaction")}
                </Typography>
                <Typography
                  color={mode === "light" ? "green" : "#09b3a2"}
                  variant="h4"
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                >
                  87%
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                  mb={2}
                  color="#999"
                >
                  میانگین امتیاز و نرخ بازخورد
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                >
                  زمان تحویل میانگین: 3،8 روز
                </Typography>
                <Typography
                  textAlign={{ xs: "center", sm: "center", md: "left" }}
                >
                  {" "}
                  پیام های خوانده نشده: 6
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
