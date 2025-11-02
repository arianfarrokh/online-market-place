// import { AddNewProductVariable } from "@/app/base-info/dashboard/product-management/product/graphql";
// import { useTranslation } from "@/providers/translation";
// import { Box, Stack, TextField } from "@mui/material";
// import React from "react";

// interface Props {
//   data: AddNewProductVariable;
//   updateData: (newData: Partial<AddNewProductVariable>) => void;
// }

// const InventoryPage = ({ data, updateData }: Props) => {
//   const { t } = useTranslation();

//   return (
//     <Box>
//       <Stack>
//         <TextField
//           required
//           label={t("form", "inventory")}
//           type="number"
//           value={data.inventory ?? 0}
//           onChange={(e) => updateData({ inventory: Number(e.target.value) })}
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
//       </Stack>
//     </Box>
//   );
// };

// export default InventoryPage;


import React from "react";
import { Box } from "@mui/material";
import { FormikProps } from "formik";
import { ProductType } from "../type";
import { FullWidthTextField } from "@/components";

interface Props {
  formik: FormikProps<ProductType>;
}

const InventoryPage: React.FC<Props> = ({ formik }) => {
  return (
    <Box>
      <FullWidthTextField formik={formik} id="inventory"name="inventory" type="number" 
              sx={{
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]": { MozAppearance: "textfield" },
        }}/>
    </Box>
  );
};

export default InventoryPage;
