// import { AddNewProductVariable } from "@/app/base-info/dashboard/product-management/product/graphql";
// import { useTranslation } from "@/providers/translation";
// import {
//   Box,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Typography,
//   TextField,
// } from "@mui/material";
// import React from "react";

// interface Props {
//   data: AddNewProductVariable;
//   updateData: (newData: Partial<AddNewProductVariable>) => void;
// }

// const Productfeatures = ({ data, updateData }: Props) => {
//   const { t } = useTranslation("common", "form");

//   return (
//     <Box component="form">
//       <Typography variant="h6" gutterBottom>
//         ویژگی‌های محصول
//       </Typography>
//       <FormControl id="ProductFeatures" fullWidth margin="normal">
//         <InputLabel required>ویژگی‌های محصول</InputLabel>
//         <Select
//           id="ProductFeatures"
//           labelId="ProductFeatures"
//           label="ProductFeatures"
//           value={data.ProductFeatures ?? ""}
//           onChange={(e) => updateData({ ProductFeatures: e.target.value })}
//         >
//           <MenuItem value="color">رنگ</MenuItem>
//           <MenuItem value="size">سایز</MenuItem>
//           <MenuItem value="material">جنس</MenuItem>
//         </Select>
//       </FormControl>
//       <TextField
//         required
//         label="مقدار ویژگی"
//         fullWidth
//         margin="normal"
//         value={data.featureValue ?? ""}
//         onChange={(e) => updateData({ featureValue: e.target.value })}
//         placeholder={t("form", "Enter-the-attribute-value")}
//       />
//     </Box>
//   );
// };

// export default Productfeatures;

import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FormikProps } from "formik";
import { ProductType } from "../type";
import { FullWidthTextField } from "@/components";
import { useTranslation } from "@/providers/translation";

interface Props {
  formik: FormikProps<ProductType>;
}

const Productfeatures: React.FC<Props> = ({ formik }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>{t("form", "products-features")}</InputLabel>
        <Select
          label="products-features**"
          {...formik.getFieldProps("ProductFeatures")}
        >
          <MenuItem value="color">{t("form", "color")}</MenuItem>
          <MenuItem value="size">{t("form", "size")}</MenuItem>
          <MenuItem value="material">{t("form", "material")}</MenuItem>
        </Select>
      </FormControl>
      <FullWidthTextField
        formik={formik}
        id="featureValue"
        name="featureValue"
        placeholder="مقدار ویژگی را وارد کنید"
      />
    </Box>
  );
};

export default Productfeatures;
