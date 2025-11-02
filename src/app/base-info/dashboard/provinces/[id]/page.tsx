"use client";
import { BasePage } from "@/components";
import React from "react";
import ProvinceForm from "../province-form";
import { provinceByIdQuery, updateProvinceMutation } from "../graphql";
import { useRouter } from "next/navigation";
import { ResultById } from "@/graphql/query-types";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useTranslation } from "@/providers/translation";
import { useMutation, useQuery } from "@apollo/client/react";
import { formatString } from "@/utils";
import { FaMountainCity } from "react-icons/fa6";

type Props = {
  params: Promise<{ id: string }>;
};

const initData: ProvinceType = {
  id: 0,
  prefixNumber: "",
  name: "",
};

const EditProvincePage: React.FC<Props> = ({ params }) => {
  const { id } = React.use(params);
  const { t } = useTranslation("error", "common");
  const { show } = useAlert();
  const router = useRouter();

  const [province, setProvince] = React.useState<ProvinceType>(initData);

  const { data, loading, error } = useQuery<ResultById<ProvinceType>>(
    provinceByIdQuery,
    {
      fetchPolicy: "no-cache",
      variables: { id: parseInt(id) },
    }
  );

  const [
    update,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(updateProvinceMutation, {
    fetchPolicy: "no-cache",
  });

  React.useEffect(() => {
    if (!loading && data) {
      setProvince(data.result);
    }
  }, [data, loading]);

  const handleSave = (data: ProvinceType) => {
    update({
      variables: {
        input: {
          id: data.id,
          name: data.name,
          prefixNumber: data.prefixNumber,
        },
      },
    });
  };

  /**
   * useEffect → update local state after query result arrives
   */
  React.useEffect(() => {
    if (!loading && data) {
      setProvince(data.result);
    }
  }, [data, loading]);

  React.useEffect(() => {
    if (!updateLoading && updateData) {
      show({
        message: formatString(
          t("common", "update-successfully"),
          t("form", "province")
        ),
        type: "success",
        autoHideDuration: 4000,
      });
      router.back();
    }
    if (!updateLoading && updateError) {
      show({
        message: formatString(
          t("error", "failed-to-update"),
          t("form", "province")
        ),
        type: "success",
        autoHideDuration: 4000,
      });
    }
  }, [router, show, t, updateData, updateError, updateLoading]);

  return (
    <BasePage
      maxWidth="md"
      PageIcon={<FaMountainCity fontSize={24} />}
      error={error || updateError || updateData?.response.errors}
      pageTitle={`${t("common", "update")} ${t("form", "province")}`}
    >
      <ProvinceForm province={province} onSave={handleSave} />
    </BasePage>
  );
};

export default EditProvincePage;
