// import { AddNewProductVariable } from "@/app/base-info/dashboard/product-management/product/graphql";
// import { useTranslation } from "@/providers/translation";
// import {
//   Box,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   InputLabel,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   Select,
//   TextField,
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
// import React, { useState } from "react";
// import { format, parse } from "date-fns-jalali";

// interface Props {
//   data: AddNewProductVariable;
//   updateData: (newData: Partial<AddNewProductVariable>) => void;
// }

// const Shiping = ({ data, updateData }: Props) => {
//   const [freeShipping, setFreeShipping] = useState<boolean>(false);
//   const { t } = useTranslation("common", "form");
//   const dateFormat = "yyyy/MM/dd";

//   return (
//     <Box component="form">
//       <FormControl component="fieldset" margin="normal">
//         <FormLabel component="legend">{t("form", "Free-shipping")}</FormLabel>
//         <RadioGroup
//           row
//           value={freeShipping ? "yes" : "no"}
//           onChange={(e) => {
//             setFreeShipping(e.target.value === "yes");
//             if (e.target.value === "yes") {
//               updateData({ price: 0 });
//             }
//           }}
//         >
//           <FormControlLabel value="yes" control={<Radio />} label="بله" />
//           <FormControlLabel value="no" control={<Radio />} label="خیر" />
//         </RadioGroup>
//       </FormControl>
//       {!freeShipping && (
//         <TextField
//           required
//           label={t("form", "Shipping-cost")}
//           value={data.price ?? 0}
//           onChange={(e) => updateData({ price: Number(e.target.value) })}
//           fullWidth
//           margin="normal"
//           type="number"
//           inputProps={{ style: { MozAppearance: "textfield" } }}
//           sx={{
//             "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
//               {
//                 WebkitAppearance: "none",
//                 margin: 0,
//               },
//             "& input[type=number]": { MozAppearance: "textfield" },
//           }}
//         />
//       )}
//       <FormControl fullWidth margin="normal">
//         <InputLabel required id="shipping-method">
//           {t("form", "shipping-method")}
//         </InputLabel>
//         <Select
//           id="shipping-method"
//           label="نوع ارسال"
//           value={data.shippingMethod ?? ""}
//           onChange={(e) => updateData({ shippingMethod: e.target.value })}
//         >
//           <MenuItem value="post">پست</MenuItem>
//           <MenuItem value="tipax">تیپاکس</MenuItem>
//         </Select>
//       </FormControl>
//       <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
//         <DatePicker
//           label={t("form", "Estimated-delivery-days")}
//           value={data.date ? parse(data.date, dateFormat, new Date()) : null}
//           onChange={(newValue) => {
//             if (newValue && !isNaN(newValue.getTime())) {
//               updateData({ date: format(newValue, dateFormat) });
//             } else {
//               updateData({ date: "" });
//             }
//           }}
//           slotProps={{
//             textField: {
//               fullWidth: true,
//               margin: "normal",
//               sx: {
//                 "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
//                   {
//                     WebkitAppearance: "none",
//                     margin: 0,
//                   },
//                 "& input[type=number]": { MozAppearance: "textfield" },
//               },
//             },
//           }}
//         />
//       </LocalizationProvider>
//       <FormControl fullWidth margin="normal">
//         <InputLabel id="Returnable">قابل بازگشت</InputLabel>
//         <Select
//           id="Returnable"
//           labelId="Returnable"
//           label="Returnable"
//           value={data.Returnable ?? ""}
//           onChange={(e) => updateData({ Returnable: e.target.value })}
//         >
//           <MenuItem value="yes">بله</MenuItem>
//           <MenuItem value="no">خیر</MenuItem>
//         </Select>
//       </FormControl>
//     </Box>
//   );
// };

// export default Shiping;

import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { FormikProps } from "formik";
import { ProductType } from "../type";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { parse, format } from "date-fns-jalali";
import { FullWidthTextField } from "@/components";
import { useTranslation } from "@/providers/translation";

interface Props {
  formik: FormikProps<ProductType>;
}

const Shiping: React.FC<Props> = ({ formik }) => {
  const [freeShipping, setFreeShipping] = useState<boolean>(
    formik.values.price === 0
  );
  const dateFormat = "yyyy/MM/dd";

  const { t } = useTranslation();

  return (
    <Box>
      <FormControl component="fieldset" margin="normal">
        <FormLabel>{t("form", "Free-shipping")}</FormLabel>
        <RadioGroup
          row
          value={freeShipping ? "yes" : "no"}
          onChange={(e) => {
            setFreeShipping(e.target.value === "yes");
            if (e.target.value === "yes") {
              formik.setFieldValue("price", 0);
            }
          }}
        >
          <FormControlLabel
            value="yes"
            control={<Radio />}
            label={t("common", "yes")}
          />
          <FormControlLabel
            value="no"
            control={<Radio />}
            label={t("common", "no")}
          />
        </RadioGroup>
      </FormControl>

      {!freeShipping && (
        <FullWidthTextField
          formik={formik}
          id="Shipping-cost"
          type="number"
          name="price"
          sx={{
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
              {
                WebkitAppearance: "none",
                margin: 0,
              },
            "& input[type=number]": { MozAppearance: "textfield" },
          }}
        />
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel id="Returnable">{t("form", "shipping-method")}</InputLabel>
        <Select label="shipping" {...formik.getFieldProps("shipping-method")}>
          <MenuItem value="post">{t("form", "post")}</MenuItem>
          <MenuItem value="tipax">{t("form", "tipax")}</MenuItem>
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
        <DatePicker
          label={t("form", "Estimated-delivery-days")}
          value={
            formik.values.date
              ? parse(formik.values.date, dateFormat, new Date())
              : null
          }
          onChange={(newValue) => {
            if (newValue && !isNaN(newValue.getTime())) {
              formik.setFieldValue("date", format(newValue, dateFormat));
            } else {
              formik.setFieldValue("date", "");
            }
          }}
          slotProps={{
            textField: { fullWidth: true, margin: "normal", size: "small" },
          }}
        />
      </LocalizationProvider>

      <FormControl fullWidth margin="normal">
        <InputLabel id="Returnable">{t("form", "Returnable")}</InputLabel>
        <Select
          id="Returnable"
          label="Returnable*"
          {...formik.getFieldProps("Returnable")}
        >
          <MenuItem value="yes">{t("common", "yes")}</MenuItem>
          <MenuItem value="no">{t("common", "no")}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default Shiping;
