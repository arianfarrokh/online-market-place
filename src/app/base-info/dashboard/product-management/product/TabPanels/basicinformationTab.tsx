// "use client";

// import React from "react";
// import { useTranslation } from "@/providers/translation";
// import {
//   Box,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import { AddNewProductVariable } from "@/app/base-info/dashboard/product-management/product/graphql";
// import { BsBookmarkCheckFill, BsBookmarkXFill } from "react-icons/bs";

// interface Props {
//   data: AddNewProductVariable;
//   updateData: (newData: Partial<AddNewProductVariable>) => void;
// }

// const BasicInformation = ({ data, updateData }: Props) => {
//   const { t } = useTranslation("common", "form");

//   return (
//     <Box component="form">
//       <TextField
//         label={t("form", "product-id")}
//         value={data.productId ?? 0}
//         onChange={(e) => updateData({ productId: Number(e.target.value) })}
//         fullWidth
//         margin="normal"
//         type="number"
//         inputProps={{ style: { MozAppearance: "textfield" } }}
//         sx={{
//           "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
//             {
//               WebkitAppearance: "none",
//               margin: 0,
//             },
//           "& input[type=number]": { MozAppearance: "textfield" },
//         }}
//       />
//       <TextField
//         label={t("form", "product-name")}
//         value={data.name ?? ""}
//         onChange={(e) => updateData({ name: e.target.value })}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label={t("form", "description")}
//         value={data.description ?? ""}
//         onChange={(e) => updateData({ description: e.target.value })}
//         multiline
//         rows={8}
//         maxRows={20}
//         fullWidth
//         margin="normal"
//         placeholder="توضیحات کامل محصول را اینجا وارد کنید"
//         sx={{ "& .MuiInputBase-root": { padding: "12px" } }}
//       />
//       <FormControl fullWidth margin="normal">
//         <InputLabel id="category">{t("form", "category")}</InputLabel>
//         <Select
//           labelId="category"
//           label="category"
//           value={data.category ?? ""}
//           onChange={(e) => updateData({ category: e.target.value })}
//         >
//           <MenuItem value="electronics">الکترونیک</MenuItem>
//           <MenuItem value="clothing">لباس</MenuItem>
//         </Select>
//       </FormControl>
//       <FormControl fullWidth margin="normal">
//         <InputLabel id="status">{t("common", "status")}</InputLabel>
//         <Select
//           labelId="status"
//           label="status"
//           value={data.status ?? "ACTIVE"}
//           onChange={(e) => updateData({ status: e.target.value })}
//         >
//           <MenuItem value="ACTIVE">
//             {t("common", "Actie")} <BsBookmarkCheckFill />
//           </MenuItem>
//           <MenuItem value="INACTIVE">
//             {t("common", "InActive")} <BsBookmarkXFill />
//           </MenuItem>
//         </Select>
//       </FormControl>
//     </Box>
//   );
// };

// export default BasicInformation;

import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { BsBookmarkCheckFill, BsBookmarkXFill } from "react-icons/bs";
import { FullWidthTextField } from "@/components";
import { FormikProps } from "formik";
import { ProductType } from "../type";
import { useTranslation } from "@/providers/translation";

interface Props {
  formik: FormikProps<ProductType>;
}

const BasicInformation: React.FC<Props> = ({ formik }) => {
  const { t } = useTranslation("common", "form", "enum", "error");
  return (
    <Box>
      <FullWidthTextField
        formik={formik}
        id="product-id"
        name="productId"
        type="number"
        sx={{
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              WebkitAppearance: "none",
              margin: 0,
            },
          "& input[type=number]": { MozAppearance: "textfield" },
        }}
      />
      <FullWidthTextField formik={formik} id="product-name" name="name" />
      <FullWidthTextField
        formik={formik}
        id="description"
        name="description"
        multiline
        rows={8}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="category">{t("form", "category")}</InputLabel>
        <Select
          id="category"
          label="*category*"
          {...formik.getFieldProps("category")}
          error={formik.touched.category && Boolean(formik.errors.category)}
        >
          <MenuItem value="electronics">{t("form", "Electronics")}</MenuItem>
          <MenuItem value="clothing">{t("form", "Clothes")}</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="status">{t("common", "status")}</InputLabel>
        <Select
          label="*status*"
          {...formik.getFieldProps("status")}
          value={formik.values.status}
          error={formik.touched.status && Boolean(formik.errors.status)}
        >
          <MenuItem value="ACTIVE">
            {t("enum", "ACTIVE")} <BsBookmarkCheckFill />
          </MenuItem>
          <MenuItem value="INACTIVE">
            {t("enum", "INACTIVE")} <BsBookmarkXFill />
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default BasicInformation;
