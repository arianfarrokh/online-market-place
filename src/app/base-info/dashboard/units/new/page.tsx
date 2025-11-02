"use client";

import { BasePage } from "@/components";
import React from "react";
import { TbCategory2 } from "react-icons/tb";
import UnitForm from "../unit-form";
import { addNewUnitMutation } from "../graphql";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { useTranslation } from "@/providers/translation";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { formatString } from "@/utils";

const initData: UnitType = {
  id: 0,
  unitName: "",
};

const NewUnitPage = () => {
  const { t } = useTranslation("common", "form", "error");
  const router = useRouter();
  const { show } = useAlert();

  const [addNewRecord, { data, error }] = useMutation(addNewUnitMutation, {
    fetchPolicy: "no-cache",
    onCompleted(data) {
      const errors = data?.response?.errors;

      if (errors && errors.length > 0) {
        // Show backend error message(s)
        show({
          type: "error",
          message:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            errors.map((e: any) => e.message).join(", ") ||
            formatString(t("error", "failed-to-add"), t("form", "unit")),
          autoHideDuration: 3000,
        });
      } else if (data?.response?.result) {
        // Success
        show({
          type: "success",
          message: formatString(
            t("common", "add-successfully"),
            t("form", "unit")
          ),
          autoHideDuration: 3000,
        });
        router.back();
      } else {
        // Unexpected case
        show({
          type: "error",
          message: formatString(t("error", "failed-to-add"), t("form", "unit")),

          autoHideDuration: 3000,
        });
      }
    },
    onError(err) {
      // Network or GraphQL error
      show({
        type: "error",
        message:
          err.message ||
          formatString(t("error", "failed-to-add"), t("form", "unit")),

        autoHideDuration: 3000,
      });
    },
  });

  const handleSave = (data: UnitType) => {
    addNewRecord({
      variables: {
        unitName: data.unitName,
      },
    });
  };

  return (
    <BasePage
      pageTitle={`${t("common", "add-new")} ${t("form", "unit")}`}
      maxWidth="md"
      PageIcon={<TbCategory2 fontSize={24} />}
      error={error || data?.response?.errors}
    >
      <UnitForm unit={initData} onSave={handleSave} />
    </BasePage>
  );
};

export default NewUnitPage;
