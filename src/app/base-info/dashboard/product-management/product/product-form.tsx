import { useTranslation } from "@/providers/translation";
import { Box, CardContent, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { ProductType } from "./type";
import { RiInformation2Line } from "react-icons/ri";
import { IoPricetagOutline } from "react-icons/io5";
import {
  MdLocalShipping,
  MdOutlineFeaturedPlayList,
  MdOutlineInventory,
} from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { useThemeContext } from "@/theme/ThemeContext";
import BasicInformation from "./TabPanels/basicinformationTab";
import Prices from "./TabPanels/pricesTab";
import Shiping from "./TabPanels/shipingTab";
import InventoryPage from "./TabPanels/inventoryTab";
import Productfeatures from "./TabPanels/productfeaturesTab";
import { FormActionButtons } from "@/components";
import ImageUploader from "./TabPanels/image/ImageUploader";

// *تعریف پراپ‌ها برای کامپوننت فرم
type Props = {
  product: ProductType; // *اطلاعات محصول
  onSave: (product: ProductType) => void; // *تابع برای ذخیره محصول
};

// *مقادیر اولیه فرم
const initialValues: ProductType = {
  id: 0,
  name: "",
  description: "",
  category: "",
  image: "",
  imagePreview: "",
  productId: 0,
  price: 0,
  status: "ACTIVE",
  stock: 0,
  oldPrice: 0,
  shippingMethod: "",
  Returnable: "",
  ProductFeatures: "",
  featureValue: "",
  date: "",
  inventory: 0,
};

// *کامپوننت اصلی فرم برای ویرایش یا افزودن برچسب
const Productform: React.FC<Props> = ({ product, onSave }) => {
  // *هوک ترجمه برای پشتیبانی از چندزبانه بودن
  const { t } = useTranslation("common", "form", "error");
  // *متغیر حالت برای مدیریت تب فعال
  const [value, setValue] = useState(0);

  // *حالت تم (روشن یا تیره) از کانتکست تم
  const { mode } = useThemeContext();

  const validationSchema = yup.object({
    name: yup.string().required(t("error", "required-field")),
    category: yup.string().required(t("error", "required-field")),
    image: yup.mixed().required(t("error", "required-field")),
    price: yup
      .number()
      .required(t("error", "required-field"))
      .min(0, t("error", "positive-number")),
    status: yup.string().required(t("error", "required-field")),
    stock: yup
      .number()
      .required(t("error", "required-field"))
      .min(0, t("error", "positive-number")),
    ProductFeatures: yup.string().required(t("error", "required-field")),
    featureValue: yup.string().when("ProductFeatures", {
      is: (ProductFeatures: string) =>
        ProductFeatures && ProductFeatures.length > 0,
      then: (schema) => schema.required(t("error", "required-field")),
      otherwise: (schema) => schema.optional(),
    }),
    inventory: yup
      .number()
      .required(t("error", "required-field"))
      .min(0, t("error", "positive-number")),
  });

  // *هوک فورمیک برای مدیریت فرم و اعتبارسنجی
  const formik = useFormik<ProductType>({
    initialValues, // *مقادیر اولیه فرم
    validationSchema,
    onSubmit(values) {
      onSave(values); // *فراخوانی تابع ذخیره هنگام ارسال فرم
    },
  });

  useEffect(() => {
    formik.setValues(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // *تعریف نوع برای پراپ‌های پنل تب
  interface TabPanelProps {
    children?: React.ReactNode; // *محتوای پنل
    index: number; // *ایندکس تب
    value: number; // *تب فعال
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Box sx={{ p: 3 }}>{children}</Box>
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  // *تابع برای تغییر تب فعال
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        bgcolor: mode === "light" ? "#cccccc" : "#393e42",
      }}
    >
      <Box
        sx={{
          maxWidth: 1800,
          width: "100%",
          maxHeight: 950,
          p: 3,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography
            variant="h5"
            gutterBottom
            textAlign={"left"}
            mb={2}
            sx={{
              textShadow:
                mode === "light" ? "0 0 8px #7a7272b6" : "0 0 8px #ff9900",
            }}
          >
            {`${t("common", "add-new")} ${t("form", "product")} `}
          </Typography>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            value={value}
            onChange={handleChange}
            aria-label="product tabs"
            sx={{
              mb: 2,
              "& .MuiTabs-indicator": {
                backgroundColor: mode === "light" ? "#c78118ff" : "#ff9900bb",
              },
            }}
          >
            <Tab
              sx={{
                color: mode === "light" ? "#000000ff" : "#ffffffff",
                "&.Mui-selected": {
                  color: mode === "light" ? "#c78118ff" : "#ff9900",
                },
              }}
              label={t("common", "basic-info")}
              icon={<RiInformation2Line size={20} />}
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                color: mode === "light" ? "#000000ff" : "#ffffffff",
                "&.Mui-selected": {
                  color: mode === "light" ? "#c78118ff" : "#ff9900",
                },
              }}
              icon={<IoPricetagOutline size={20} />}
              label={t("form", "price")}
              {...a11yProps(1)}
            />
            <Tab
              sx={{
                color: mode === "light" ? "#000000ff" : "#ffffffff",
                "&.Mui-selected": {
                  color: mode === "light" ? "#c78118ff" : "#ff9900",
                },
              }}
              icon={<MdLocalShipping size={20} />}
              label={t("form", "shipping")}
              {...a11yProps(2)}
            />
            <Tab
              sx={{
                color: mode === "light" ? "#000000ff" : "#ffffffff",
                "&.Mui-selected": {
                  color: mode === "light" ? "#c78118ff" : "#ff9900",
                },
              }}
              icon={<MdOutlineInventory size={20} />}
              label={t("form", "stock")}
              {...a11yProps(3)}
            />
            <Tab
              sx={{
                color: mode === "light" ? "#000000ff" : "#ffffffff",
                "&.Mui-selected": {
                  color: mode === "light" ? "#c78118ff" : "#ff9900",
                },
              }}
              icon={<CiImageOn size={20} />}
              label={t("form", "image")}
              {...a11yProps(4)}
            />
            <Tab
              sx={{
                color: mode === "light" ? "#000000ff" : "#ffffffff",
                "&.Mui-selected": {
                  color: mode === "light" ? "#c78118ff" : "#ff9900",
                },
              }}
              icon={<MdOutlineFeaturedPlayList size={20} />}
              label={t("form", "products-features")}
              {...a11yProps(5)}
            />
          </Tabs>
        </Box>
        <Paper
          sx={{
            boxShadow:
              mode === "light" ? "0 0 10px #000000a9" : "0 0 10px #ff9900",
          }}
        >
          <CustomTabPanel value={value} index={0}>
            <BasicInformation formik={formik} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Prices formik={formik} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Shiping formik={formik} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <InventoryPage formik={formik} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <ImageUploader formik={formik} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            <Productfeatures formik={formik} />
          </CustomTabPanel>
        </Paper>
        <CardContent
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <FormActionButtons disabled={!formik.dirty || !formik.isValid} />
        </CardContent>
      </Box>
    </Box>
  );
};

export default Productform;
