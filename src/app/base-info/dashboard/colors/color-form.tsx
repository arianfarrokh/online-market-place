"use client";
import { FormActionButtons, FullWidthTextField, PagePanel } from "@/components";
import { useTranslation } from "@/providers/translation";
import { CardContent } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

type Props = {
  color: ColorType;
  onSave: (color: ColorType) => void;
};

const initialValues: ColorType = {
  id: 0,
  colorName: "",
  colorCode: "#000000",
};

const ColorForm: React.FC<Props> = ({ color, onSave }) => {
  const { t } = useTranslation("common", "form", "error");

  const formik = useFormik<ColorType>({
    initialValues,
    validationSchema: yup.object({
      colorName: yup.string().required(t("error", "required-field")),
    }),
    onSubmit(values) {
      onSave(values);
    },
  });

  React.useEffect(() => {
    formik.setValues(color);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  return (
    <PagePanel title={`${t("common","spec")} ${t("form","color")}`}>
      <Grid
        container
        spacing={2}
        component={"form"}
        id="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <Grid size={{ xs: 12, sm: 9 }}>
          <FullWidthTextField
            formik={formik}
            id="color-name"
            name="colorName"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <FullWidthTextField
            formik={formik}
            type="color"
            name="colorCode"
            id="color-code"
          />
        </Grid>
      </Grid>
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
    </PagePanel>
  );
};

export default ColorForm;
