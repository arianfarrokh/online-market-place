"use client";

import React from "react";
import { ProductType } from "../type";
import Productform from "../product-form";
import { addNewProductMutation } from "../graphql";
import { useMutation } from "@apollo/client/react";
import { formatString } from "@/utils";
import { useRouter } from "next/navigation";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useTranslation } from "@/providers/translation";

const initData: ProductType = {
  id: 0,
  description: "",
  category: "",
  image: "",
  imagePreview: "",
  productId: 0,
  name: "",
  price: 0,
  status: "ACTIVE",
  stock: 0,
  oldPrice: 0,
  shippingMethod: "",
  Returnable: "",
  ProductFeatures: "",
  featureValue: "",
  date: "",
  inventory: 0,
};

// *تابع برای تولید پراپ‌های دسترسی‌پذیری (accessibility)
export default function ProductPage() {
  const { t } = useTranslation();

  const router = useRouter();

  const { show } = useAlert();

  const [addNewRecord, { loading, data, error }] = useMutation(
    addNewProductMutation,
    {
      fetchPolicy: "no-cache",
    }
  );

  React.useEffect(() => {
    if (!loading && data) {
      show({
        message: formatString(
          t("common", "add-successfully"),
          t("form", "product")
        ),
        type: "success",
        autoHideDuration: 3000,
      });
      router.back();
    }
    if (!loading && error) {
      show({
        message: formatString(
          t("error", "failed-to-add"),
          t("form", "product")
        ),
        type: "error",
        autoHideDuration: 3000,
      });
    }
  }, [data, error, loading, router, show, t]);

  const handleSave = (data: ProductType) => {
    addNewRecord({
      variables: {
        input: {
          id: data.id,
          description: data.description,
          category: data.category,
          image: data.category,
          imagePreview: data.imagePreview,
          productId: data.productId,
          name: data.name,
          price: data.price,
          status: data.status,
          stock: data.stock,
          oldPrice: data.oldPrice,
          shippingMethod: data.shippingMethod,
          Returnable: data.Returnable,
          ProductFeatures: data.ProductFeatures,
          featureValue: data.featureValue,
          date: data.date,
          inventory: data.inventory,
        },
      },
    });
  };

  return <Productform product={initData} onSave={handleSave} />;
}
