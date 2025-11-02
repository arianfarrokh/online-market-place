"use client";
import { BasePage } from "@/components";
import { useTranslation } from "@/providers/translation";
import React from "react";
import { TbCategory2 } from "react-icons/tb";
import ColorForm from "../color-form";
import { createColorMutation } from "../graphql";
import { useRouter } from "next/navigation";
import { authContext } from "@/auth/authContext";
import { useMutation } from "@apollo/client/react";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { formatString } from "@/utils";

interface ColorType {
  id: number;
  colorName: string;
  colorCode: string;
}

// Define the mutation response type
interface MutationResponse {
  response: {
    result?: { id: number };
    errors?: { __typename: string; message?: string }[];
  };
}

const initData: ColorType = {
  id: 0,
  colorName: "",
  colorCode: "",
};

const NewColorPage = () => {
  const { t } = useTranslation("common", "form", "error");
  const router = useRouter();
  const { show } = useAlert();

  const [addNewRecord,] = useMutation<MutationResponse>(
    createColorMutation,
    {
      context: authContext(),
      fetchPolicy: "no-cache",
      onCompleted(data) {
        if (data.response.result) {
          show({
            message: formatString(t("common", "add-successfully"), t("form", "color")),
            type: "success",
            autoHideDuration: 3000,
          });
          router.back();
        } else if (data.response.errors && data.response.errors.length > 0) {
          const errorMessages = data.response.errors
            .map((e) => e.message || "")
            .filter(Boolean)
            .join("\n");
          show({
            message: errorMessages,
            type: "error",
            autoHideDuration: 4000,
          });
        }
      },
    }
  );

  const handleSave = (data: ColorType) => {
    addNewRecord({
      variables: {
        colorName: data.colorName,
        colorCode: data.colorCode,
      },
    });
  };

  return (
    <BasePage
      pageTitle={`${t("common", "add-new")} ${t("form", "color")}`}
      maxWidth="md"
      PageIcon={<TbCategory2 fontSize={24} />}
    >
      <ColorForm color={initData} onSave={handleSave} />
    </BasePage>
  );
};

export default NewColorPage;