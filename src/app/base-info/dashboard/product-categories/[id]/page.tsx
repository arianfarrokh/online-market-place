"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BasePage } from "@/components";
import ProductCategoryForm, { ProductCategoryType } from "../product-category-form";
import { TbCategory2 } from "react-icons/tb";
import {
  productCategoryByIdQuery,
  updateProductCategoryMutation,
  allProductCategoriesNoPagedQuery,
} from "../graphql";
import { ResultById } from "@/graphql/query-types";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useDialog } from "@/providers/dialog-provider/DialogProvider";
import { useTranslation } from "@/providers/translation";
import { useMutation, useQuery } from "@apollo/client/react";
import { formatString } from "@/utils";

type Props = { params: Promise<{ id: string }> };

const initData: ProductCategoryType = {
  id: 0,
  name: "",
  parent: null,
  parentId: null,
  children: [],
};

// Recursive helper to collect all descendant IDs
const getDescendantIds = (category: ProductCategoryType): number[] => {
  if (!category.children?.length) return [];
  return category.children.reduce<number[]>(
    (acc, child) => [...acc, child.id, ...getDescendantIds(child)],
    []
  );
};

const EditProductCategoryPage: React.FC<Props> = ({ params }) => {
  const { t } = useTranslation("common", "form", "error");
  const router = useRouter();
  const { show } = useAlert();
  const { show: showDialog, hide: hideDialog } = useDialog();

  const [productCategory, setProductCategory] = useState<ProductCategoryType>(initData);

  // ---------------- Unwrap params ----------------
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  // Fetch the category by ID
  const { data, loading, error } = useQuery<ResultById<ProductCategoryType>>(
    productCategoryByIdQuery,
    {
      fetchPolicy: "no-cache",
      variables: { id: parseInt(id, 10) },
    }
  );

  // Fetch all categories to find parent name
  const { data: allData } = useQuery<{ allProductCategoriesNoPage: ProductCategoryType[] }>(
    allProductCategoriesNoPagedQuery,
    { fetchPolicy: "no-cache" }
  );

  const [updateCategory, { error: updateError, data: updateData }] = useMutation(
    updateProductCategoryMutation,
    {
      fetchPolicy: "no-cache",
      onCompleted(data) {
        if (data.response?.errors?.length) {
          show({
            message: formatString(t("error", "failed-to-update"),t("form","product-category")),
            type: "error",
            autoHideDuration: 3000,
          });
        } else {
          show({
            message: t("form", "success-to-update-category"),
            type: "success",
            autoHideDuration: 1500,
          });
          setTimeout(() => router.back(), 1500);
        }
      },
      onError() {
        show({
          message: formatString(t("error", "failed-to-update"),t("form","product-category")),
          type: "error",
          autoHideDuration: 2000,
        });
      },
    }
  );

  const handleSave = (data: ProductCategoryType) => {
    const invalidParentIds = [data.id, ...getDescendantIds(productCategory)];

    if (data.parent?.id && invalidParentIds.includes(data.parent.id)) {
      showDialog(
        t("form", "product-categories"),
        t("error", "invalid-parent-selection"),
        {
          maxWidth: "xs",
          confirmText: t("common", "ok"),
          onConfirm: hideDialog,
          onCancel: hideDialog,
        }
      );
      return;
    }

    updateCategory({
      variables: {
        id: data.id,
        name: data.name,
        parentId: data.parent?.id ?? null,
        sortOrder: 1,
      },
    });
  };

  useEffect(() => {
    if (!loading && data?.result) {
      const category = data.result;

      // Lookup parent category from all categories
      const allCategories = allData?.allProductCategoriesNoPage || [];
      const parent =
        category.parentId != null
          ? allCategories.find((c) => c.id === category.parentId) || { id: category.parentId, name: "" }
          : null;

      setProductCategory({
        ...category,
        parent,
      });
    }
  }, [data, allData, loading]);

  return (
    <BasePage
      pageTitle={`${t("common", "edit")} ${t("form","product-category")}`}
      PageIcon={<TbCategory2 fontSize={24} />}
      error={error || updateError || updateData?.response?.errors}
      maxWidth="md"
    >
      {loading ? (
        <div>{t("common", "loading")}...</div>
      ) : (
        <ProductCategoryForm productCategory={productCategory} onSave={handleSave} />
      )}
    </BasePage>
  );
};

export default EditProductCategoryPage;
