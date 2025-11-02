// import React from "react";
// import { useTranslation } from "@/providers/translation";
// import { Box, TextField } from "@mui/material";
// import { AddNewProductVariable } from "@/app/base-info/dashboard/product-management/product/graphql";

// interface Props {
//   data: AddNewProductVariable;
//   updateData: (newData: Partial<AddNewProductVariable>) => void;
// }

// const Prices = ({ data, updateData }: Props) => {
//   const { t } = useTranslation("common", "form");

//   return (
//     <Box component="form">
//       <TextField
//         label={t("form", "product-price")}
//         value={data.price ?? 0}
//         onChange={(e) => updateData({ price: Number(e.target.value) })}
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
//         placeholder="Enter product price"
//         required
//         helperText="قیمت فعلی محصول (اجباری)"
//       />
//       <TextField
//         label={t("form", "product-old-price")}
//         value={data.oldPrice ?? 0}
//         onChange={(e) => updateData({ oldPrice: Number(e.target.value) })}
//         fullWidth
//         margin="normal"
//         type="number"
//         helperText="قیمت قدیمی یا تخفیفی (اختیاری)"
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
//     </Box>
//   );
// };

// export default Prices;

import React from "react";
import { Box } from "@mui/material";
import { FormikProps } from "formik";
import { ProductType } from "../type";
import { FullWidthTextField } from "@/components";

interface Props {
  formik: FormikProps<ProductType>;
}

const Prices: React.FC<Props> = ({ formik }) => {
  return (
    <Box>
      <FullWidthTextField formik={formik} id="price" name="price" type="number" 
              sx={{
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]": { MozAppearance: "textfield" },
        }}/>
      <FullWidthTextField formik={formik} id="product-old-price" name="oldPrice" type="number"
              sx={{
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]": { MozAppearance: "textfield" },
        }} />
    </Box>
  );
};

export default Prices;
