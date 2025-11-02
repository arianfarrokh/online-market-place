import { FormActionButtons, FullWidthTextField, PagePanel } from "@/components";
import { useTranslation } from "@/providers/translation";
import {
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

// تعریف پراپ‌ها برای کامپوننت فرم
type Props = {
  feature: FeatureType; // اطلاعات برچسب
  onSave: (feature: FeatureType) => void; // تابع برای ذخیره برچسب
};

// مقادیر اولیه فرم
const initialValues: FeatureType = {
  id: 0,
  name: "",
  value: "",
  status: "ACTIVE"
}


// کامپوننت اصلی فرم برای ویرایش یا افزودن برچسب
const FeatureForm: React.FC<Props> = ({ feature, onSave }) => {
  // هوک ترجمه برای پشتیبانی از چندزبانه بودن
  const { t } = useTranslation("common", "form", "error", "enum");

  // هوک فورمیک برای مدیریت فرم و اعتبارسنجی
  const formik = useFormik<FeatureType>({
    initialValues, // مقادیر اولیه فرم
    validationSchema: yup.object({
      name: yup.string().required(t("error", "required-field")), // اعتبارسنجی فیلد نام
    }),
    onSubmit(values) {
      onSave(values); // فراخوانی تابع ذخیره هنگام ارسال فرم
    },
  });

  // افکت برای به‌روزرسانی مقادیر فرم هنگام تغییر پراپ tag
  React.useEffect(() => {
    formik.setValues(feature);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature]);

  return (
    <PagePanel
      title={t("common", "spec")} // عنوان پنل فرم
    >
      <Grid
        container
        spacing={2}
        component={"form"}
        id="form"
        onSubmit={formik.handleSubmit} // مدیریت ارسال فرم
        noValidate
      >
        <Grid size={{ xs: 12 }}>
          <FullWidthTextField formik={formik} id="feature" name="name" />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl>
            <FormLabel>{t("common", "status")} </FormLabel>
            <RadioGroup
              name="status"
              value={formik.values.value}
              onChange={formik.handleChange} // مدیریت تغییرات انتخاب وضعیت
            >
              <FormControlLabel
                value="ACTIVE"
                control={<Radio />}
                label={t("enum", "ACTIVE")}
              />
              <FormControlLabel
                value="INACTIVE"
                control={<Radio />}
                label={t("enum", "INACTIVE")}
              />
            </RadioGroup>
          </FormControl>
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

export default FeatureForm;
