import { FormActionButtons, FullWidthTextField, PagePanel } from "@/components";
import { useTranslation } from "@/providers/translation";
import { useQuery } from "@apollo/client/react";
import { Autocomplete } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { allProvincesNoPagedQuery } from "./graphql";

type Props = {
  city: CityType;
  onSave: (city: CityType) => void;
};

const initialValues: CityType = {
  id: 0,
  province: null,
  name: "",
};

const CityForm: React.FC<Props> = ({ city, onSave }) => {
  const { t } = useTranslation("common", "form", "error");
  const {
    data: allProvincesNoPaged = { result: [] },
    loading: provincesLoading,
    error: provincesError,
  } = useQuery(allProvincesNoPagedQuery, {
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
  });

  React.useEffect(() => {}, [
    allProvincesNoPaged,
    provincesError,
    provincesLoading,
  ]);

  const formik = useFormik<CityType>({
    initialValues,
    validationSchema: yup.object({
      province: yup.object().nullable().required(t("error", "required-field")),
      name: yup.string().required(t("error", "required-field")),
    }),
    onSubmit(values) {
      onSave(values);
    },
  });

  React.useEffect(() => {
    formik.setValues(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  React.useEffect(() => {
    if (
      !provincesLoading &&
      allProvincesNoPaged?.result.length > 0 &&
      !formik.values.province
    ) {
      formik.setFieldValue("province", allProvincesNoPaged.result[0]);
    }
  }, [provincesLoading, allProvincesNoPaged, formik]);

  if (provincesLoading) {
    return <div>Loading provinces...</div>;
  }

  if (provincesError) {
    return <div>Error loading provinces: {provincesError.message}</div>;
  }

  return (
    <PagePanel title={`${t("common", "spec")} ${t("form", "cities")}`}>
      <Grid
        container
        spacing={2}
        component={"form"}
        id="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            options={allProvincesNoPaged?.result ?? []}
            size="small"
            isOptionEqualToValue={(option, value) =>
              option.id === (value?.id ?? 0)
            }
            getOptionLabel={(option: ProvinceType) => option.name || ""}
            value={formik.values.province}
            onChange={(e: unknown, value: ProvinceType | null) => {
              formik.setValues({
                ...formik.values,
                province: value,
              });
            }}
            renderInput={(params) => (
              <FullWidthTextField
                {...params}
                formik={formik}
                onChange={undefined}
                required
                id="province"
                name="province"
                label={t("form", "province")}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FullWidthTextField formik={formik} id="city-name" name="name" />
        </Grid>
        <Grid
          spacing={2}
          gap={2}
          display={"flex"}
          justifyContent={"flex-end"}
          size={{ xs: 12 }}
        >
          <FormActionButtons disabled={!formik.dirty || !formik.isValid} />
        </Grid>
      </Grid>
    </PagePanel>
  );
};

export default CityForm;
