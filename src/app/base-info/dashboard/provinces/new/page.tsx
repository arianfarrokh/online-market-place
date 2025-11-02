"use client";
import { BasePage } from "@/components";
import { useTranslation } from "@/providers/translation";
import React from "react";
import { FaMountainCity } from "react-icons/fa6";
import ProvinceForm from "../province-form";
import { addNewProvinceMutation } from "../graphql";
import { useRouter } from "next/navigation";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useMutation } from "@apollo/client/react";
import { formatString } from "@/utils";

/**
 * * Initial data for a new province
 */
const initData: ProvinceType = {
  id: 0,
  name: "",
  prefixNumber: "",
};

// * Add new province page component
const NewProvincePage = () => {
  const { t } = useTranslation("common", "form", "error");
  const { show } = useAlert()
  const router = useRouter();

  /**
   * Apollo mutation for adding a new province
   */
  const [addNewRecord, {loading,data, error }] = useMutation(addNewProvinceMutation, {
    fetchPolicy: "no-cache",
  }
);

  /**
   * handle add new record
   */
  const handleSave = (data: ProvinceType) => {
    addNewRecord({
      variables: {
        input: {
          name: data.name,
          prefixNumber: data.prefixNumber,
        },
      },
    });
  };

  React.useEffect(() => {
      if (!loading && data) {
        show({
          message: formatString(t("common", "add-successfully"), t("form", "province")),
          type: "success",
          autoHideDuration: 2000,
        });
        router.back();
      }
      if (!loading && error) {
        show({
          message: formatString(t("error", "failed-to-add"), t("form", "province")),
          type: "error",
          autoHideDuration: 2000,
        });
      }
    }, [data, error, loading, router, show, t]);

  return (
    <BasePage
      pageTitle={`${t('common', 'add-new')} ${t("form","province")}`}
      maxWidth="md"
      PageIcon={<FaMountainCity fontSize={24} />}
      error={error || data?.response?.errors}
    >
      <ProvinceForm province={initData} onSave={handleSave} />
    </BasePage>
  );
};

export default NewProvincePage;
