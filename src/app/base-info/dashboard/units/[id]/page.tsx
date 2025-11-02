"use client";

import { BasePage } from "@/components";
import React from "react";
import { TbCategory2 } from "react-icons/tb";
import UnitForm from "../unit-form";
import { unitByIdQuery, updateUnitMutation } from "../graphql";
import { useRouter } from "next/navigation";
import { ResultById } from "@/graphql/query-types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useTranslation } from "@/providers/translation";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { formatString } from "@/utils";

type Props = {
  params: Promise<{ id: string }>;
};

const initData: UnitType = {
  id: 0,
  unitName: "",
};

const EditUnitPage: React.FC<Props> = ({ params }) => {
  const { id } = React.use(params);
  const { t } = useTranslation("common", "form", "error");
  const router = useRouter();
  const { show } = useAlert();

  const [unit, setUnit] = React.useState<UnitType>(initData);

  const { data, loading, error } = useQuery<ResultById<UnitType>>(
    unitByIdQuery,
    {
      fetchPolicy: "no-cache",
      variables: { id: parseInt(id) },
    }
  );

  const [updateRecord, { data: updateData, error: updateError }] = useMutation(
    updateUnitMutation,
    {
      fetchPolicy: "no-cache",
      onCompleted(data) {
        const errors = data?.response?.errors;

        if (errors && errors.length > 0) {
          show({
            type: "error",
            message:
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              errors.map((e: any) => e.message).join(", ") ||
              formatString(t("error", "failed-to-update"), t("form", "unit")),
            autoHideDuration: 3000,
          });
        } else if (data?.response?.result) {
          show({
            type: "success",
            message: formatString(
              t("common", "update-successfully"),
              t("form", "unit")
            ),
            autoHideDuration: 3000,
          });
          router.back();
        } else {
          show({
            type: "error",
            message: formatString(
              t("error", "failed-to-update"),
              t("form", "unit")
            ),
            autoHideDuration: 3000,
          });
        }
      },
      onError(err) {
        show({
          type: "error",
          message:
            err.message ||
            formatString(t("error", "failed-to-update"), t("form", "unit")),
          autoHideDuration: 3000,
        });
      },
    }
  );

  const handleSave = (data: UnitType) => {
    updateRecord({
      variables: {
        id: data.id,
        unitName: data.unitName,
      },
    });
  };

  React.useEffect(() => {
    if (!loading && data) {
      setUnit(data.result);
    }
  }, [data, loading]);

  return (
    <BasePage
      pageTitle={`${t("common", "edit")} ${t("form", "unit")}`}
      maxWidth="md"
      PageIcon={<TbCategory2 fontSize={24} />}
      error={error || updateError || updateData?.response?.errors}
    >
      <UnitForm unit={unit} onSave={handleSave} />
    </BasePage>
  );
};

export default EditUnitPage;
