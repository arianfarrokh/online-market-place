"use client";
import { BasePage } from "@/components";
import { useTranslation } from "@/providers/translation";
import React from "react";
import { TbCategory2 } from "react-icons/tb";
import ColorForm from "../color-form";
import { colorByIdQuery, updateColorMutation } from "../graphql";
import { useRouter } from "next/navigation";
import { ResultById } from "@/graphql/query-types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { formatString } from "@/utils";

type Props = {
  params: Promise<{ id: string }>;
};

const initData: ColorType = {
  id: 0,
  colorName: "",
  colorCode: "",
};

const EditColorPage: React.FC<Props> = ({ params }) => {
  const { id } = React.use(params);
  const { t } = useTranslation("common", "form", "error");
  const router = useRouter();

  const { show } = useAlert();

  const [color, setColor] = React.useState<ColorType>(initData);

  const { data, loading, error } = useQuery<ResultById<ColorType>>(
    colorByIdQuery,
    {
      // context: authContext(),
      fetchPolicy: "no-cache",
      variables: {
        id: parseInt(id),
      },
    }
  );

  const [
    update,
    { data: updateData, /* loading: updateLoading, */ error: updateError },
  ] = useMutation(updateColorMutation, {
    // context: authContext(),
    fetchPolicy: "no-cache",
  });

  const handleSave = (data: ColorType) => {
    update({
      variables: {
        input: {
          id: data.id,
          colorName: data.colorName,
          colorCode: data.colorCode,
        },
      },
    });
  };

  React.useEffect(() => {
    if (!loading && data) {
      setColor(data.result);
    }
  }, [data, loading]);

  React.useEffect(() => {
    if (!loading && updateData) {
      show({
        message: formatString(t("common", "update-successfully"),t("form", "color") ),
        type: "success",
        autoHideDuration: 1000,
      });
      router.back();
    }
    if (!loading && updateError) {
      show({
        message: formatString(t("error", "failed-to-update"),t("form","color")),
        type: "error",
        autoHideDuration: 2000,
      });
    }
  }, [loading, router, show, t, updateData, updateError]);

  return (
    <BasePage
      pageTitle={`${t("common", "edit")} ${t("form","color")}` }
      maxWidth="md"
      PageIcon={<TbCategory2 fontSize={24} />}
      error={error || updateError || updateData?.response.errors}
    >
      <ColorForm color={color} onSave={handleSave} />
    </BasePage>
  );
};

export default EditColorPage;
