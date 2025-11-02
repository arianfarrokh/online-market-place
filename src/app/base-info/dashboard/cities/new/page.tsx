"use client";
import { BasePage } from "@/components";
import { useTranslation } from "@/providers/translation";
import React from "react";
import { FaMountainCity } from "react-icons/fa6";
import CityForm from "../city-form";
import { addNewCityMutation } from "../graphql";
import { useRouter } from "next/navigation";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useMutation } from "@apollo/client/react";
import { formatString } from "@/utils";

/**
 * * Initial data for a new city
 * Used as default values when creating a new record
 */
const initData: CityType = {
  id: 0,
  province: null,
  name: "",
};

// * add new city page component
const NewCityPage = () => {
  //  Multi-namespace translation (common, form, error)
  const { t } = useTranslation("common", "form", "error");
  const router = useRouter();
  const { show } = useAlert();

  /**
   * Apollo mutation for adding a new city
   * ! Important: fetchPolicy set to 'no-cache' to always fetch fresh data
   * onCompleted → navigate back if no errors, otherwise log errors
   */ const [addNewRecord, { loading, data, error }] = useMutation(
    addNewCityMutation,
    {
      // context: authContext(),
      fetchPolicy: "no-cache",
    }
  );

  /**
   * handle add new record
   * @param data
   */
  const handleSave = (data: CityType) => {
    addNewRecord({
      variables: {
        input: {
          name: data.name,
          provinceId: data.province?.id ?? 0,
        },
      },
    });
  };

  React.useEffect(() => {
    if (!loading && data) {
      show({
        message: formatString(
          t("common", "add-successfully"),
          t("form", "city")
        ),
        type: "success",
        autoHideDuration: 3000,
      });
      router.back();
    }
    if (!loading && error) {
      show({
        message: formatString(t("error", "failed-to-add"), t("form", "city")),
        type: "error",
        autoHideDuration: 3000,
      });
    }
  }, [data, error, loading, router, show, t]);

  return (
    <BasePage
      pageTitle={`${t("common", "add-new")} ${t("form", "city")}`}
      maxWidth="md"
      PageIcon={<FaMountainCity fontSize={24} />}
      error={error || data?.response.errors}
    >
      <CityForm city={initData} onSave={handleSave} />
    </BasePage>
  );
};

export default NewCityPage;
