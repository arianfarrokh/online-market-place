"use client";
import { BasePage } from "@/components";
import { useTranslation } from "@/providers/translation";
import React from "react";
import { FaMountainCity } from "react-icons/fa6";
import CityForm from "../city-form";
import {
  cityByIdQuery,
  updateCityMutation,
  UpdateCityVariable,
} from "../graphql";
import { useRouter } from "next/navigation";
import { ResultById } from "@/graphql/query-types";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useMutation, useQuery } from "@apollo/client/react";
import { formatString } from "@/utils";

// * Props type: Next.js params from route (dynamic route id)
type Props = {
  params: Promise<{ id: string }>;
};

// * Default init data → used before query returns result
const initData: CityType = {
  id: 0,
  province: null,
  name: "",
};

// * EditCityPage → Page for editing an existing city
const EditCityPage: React.FC<Props> = ({ params }) => {
  const { id } = React.use(params);
  // * define translation
  const { t } = useTranslation("common", "form", "error");
  //  * Next.js navigation hook
  const router = useRouter();

  const { show } = useAlert();

  // * Local state for city (used in form)
  const [city, setCity] = React.useState<CityType>(initData);

  /**
   * * Apollo query: fetch city by ID
   * fetchPolicy = "no-cache" → always fresh data from server
   */
  const { data, loading, error } = useQuery<ResultById<CityType>>(
    cityByIdQuery,
    {
      // context: authContext(),
      fetchPolicy: "no-cache",
      variables: {
        id: parseInt(id),
      },
    }
  );

  /**
   * * Apollo mutation: update existing city
   * ! Important: handles both success (router.back) and error cases
   */
  const [
    update,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(updateCityMutation, {
    // context: authContext(),
    fetchPolicy: "no-cache",
  });

  /**
   * handleSave → called when CityForm is submitted
   * @param data CityType
   */
  const handleSave = (data: CityType) => {
    const input: UpdateCityVariable = {
      id: data.id,
      provinceId: data.province?.id ?? 0,
      name: data.name,
    };
    update({
      variables: {
        input,
      },
    });
  };

  /**
   * useEffect → update local state after query result arrives
   */
  React.useEffect(() => {
    if (!loading && data) {
      setCity(data.result);
    }
  }, [data, loading]);

  React.useEffect(() => {
    if (!updateLoading && updateData) {
      show({
        message: formatString(
          t("common", "update-successfully"),
          t("form", "city")
        ),
        type: "success",
        autoHideDuration: 3000,
      });
      router.back();
    }
    if (!updateLoading && updateError) {
      show({
        message: formatString(
          t("error", "failed-to-update"),
          t("form", "city")
        ),
        type: "success",
        autoHideDuration: 3000,
      });
    }
  }, [router, show, t, updateData, updateError, updateLoading]);

  return (
    <BasePage
      pageTitle={`${t("common", "update")} ${t("form", "city")}`}
      maxWidth="md"
      PageIcon={<FaMountainCity fontSize={24} />}
      error={error || updateError || updateData?.response.errors}
    >
      <CityForm city={city} onSave={handleSave} />
    </BasePage>
  );
};

export default EditCityPage;
