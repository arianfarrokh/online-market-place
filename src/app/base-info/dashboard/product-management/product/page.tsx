"use client";

import React, { useRef } from "react";
import {
  AddNewButton,
  BasePage,
  DeleteActionItem,
  EditActionItem,
  PagePanel,
} from "@/components";
import { DataGridViewServer, OnPageChangedProps } from "@/components/data-grid";
import {
  initPageinationVariable,
  initPaginationModel,
  RefetchQueryModel,
} from "@/graphql/query-types";
import {
  AllProductsFilter,
  AllProductsOrder,
  allProductsQuery,
  AllProductsVariables,
  deleteProductMutation,
} from "../../product-management/product/graphql";
import {
  buildFilterWhere,
  buildSortOrder,
  getRefetchModel,
} from "@/utils/data-Grid-Helpers";
import {
  GridColDef,
  GridFilterModel,
  GridRowId,
  GridSortModel,
} from "@mui/x-data-grid";
import { formatString } from "@/utils";
import { useMutation, useQuery } from "@apollo/client/react";
import { useGridConfig } from "../../tags/grid-config";
import { useDialog } from "@/providers/dialog-provider/DialogProvider";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { TbCategory2 } from "react-icons/tb";
import useTagColumns from "./columns";
import { useTranslation } from "@/providers/translation";

export default function ProductPage() {
  const { t } = useTranslation("common", "form");
  // * useAlert hook
  const { show } = useAlert();
  //*  useDialogue
  const { show: showDialog, hide: hideDialog } = useDialog();

  const gridConfig = useGridConfig();

  // هوک میوتیشن برای حذف یک برچسب
  const [
    deleteRecord,
    { data: deleteData, error: deleteError, loading: deleteLoading },
  ] = useMutation(deleteProductMutation, {
    onCompleted: () => {
      // show(t("form", "delete-city-success"), 3000, "success");
      show({
        message: formatString(
          t("common", "delete-successfully"),
          t("form", "product")
        ),
        type: "success",
        autoHideDuration: 20000,
      });
    },
    onError: (error) => {
      show({
        message:
          formatString(
            t("error", "delete-content-error"),
            t("form", "product")
          ) || error.message,
        type: "error",
        autoHideDuration: 2000,
      });
    },

    // context: authContext(),
    fetchPolicy: "no-cache",
  });

  // حالت برای مدیریت مدل بازجستجو و صفحه‌بندی
  const [refetchModel, setRefetchModel] = React.useState<
    RefetchQueryModel<AllProductsVariables>
  >({
    variable: {
      ...initPageinationVariable,
      first: initPaginationModel.pageSize,
      where: null,
      order: [],
    },
    paginationModel: initPaginationModel,
  });

  // دکمه برای افزودن برچسب جدید
  const ActionButton = <AddNewButton href="product/new" />;

  // هوک کوئری برای دریافت تمام برچسب‌ها
  const { loading, error, data, refetch } = useQuery(allProductsQuery, {
    // context: authContext(),
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
    variables: refetchModel.variable,
  });

  // لودینگ صفحه
  const pageLoading = useRef<boolean>(true);

  if (loading) {
    pageLoading.current = true;
  } else if (!loading && pageLoading.current) {
    pageLoading.current = false;
  }

  // حالت برای ذخیره ردیف‌های جدول

  // تابع برای مدیریت حذف برچسب
  const deleteproduct = React.useCallback(
    (id: GridRowId) => () => {
      showDialog(
        t("form", "products"),
        formatString(t("form", "delete-content-dialog"), t("form", "product")),
        {
          maxWidth: "xs",
          confirmText: t("common", "delete"),
          cancelText: t("common", "cancel"),
          onConfirm: () => {
            deleteRecord({
              variables: {
                input: {
                  id: id as number,
                },
              },
            });
            hideDialog();
          },
          onCancel: hideDialog,
        }
      );
    },
    [deleteRecord, showDialog, hideDialog, t]
  );

  // تعریف ستون‌های جدول داده
  const columns: GridColDef[] = [
    ...useTagColumns(),
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: ({ id }) => [
        <EditActionItem key={0} href={`tags/${id}`} />,
        //  * Delete action
        <DeleteActionItem rowId={0} key={1} onClick={deleteproduct(id)} />,
      ],
    },
  ];

  const handlePageChanged = (paginationModel: OnPageChangedProps) => {
    if (!data) return;

    const newModel = getRefetchModel(
      refetchModel,
      paginationModel,
      data.result.pageInfo
    );

    if (newModel) {
      setRefetchModel(newModel);
    }
  };

  // مدیریت تغییرات مدل مرتب‌سازی
  const handleSortModelChange = (sortModel: GridSortModel) => {
    const order = buildSortOrder<AllProductsOrder>(sortModel, gridConfig.sort);

    setRefetchModel({
      paginationModel: { ...refetchModel.paginationModel },
      variable: {
        ...refetchModel.variable,
        ...initPageinationVariable,
        first: refetchModel.paginationModel.pageSize,
        order,
      },
    });
  };

  // مدیریت تغییرات مدل فیلتر
  const handleFilterModelChange = (filterModel: GridFilterModel) => {
    const where = buildFilterWhere<AllProductsFilter>(
      filterModel,
      gridConfig.filter,
      filterModel.logicOperator === "and" ? "and" : "or"
    );

    setRefetchModel({
      paginationModel: { ...refetchModel.paginationModel },
      variable: {
        ...refetchModel.variable,
        ...initPageinationVariable,
        first: refetchModel.paginationModel.pageSize,
        where,
      },
    });
  };

  // افکت برای بازجستجو داده‌ها پس از حذف برچسب
  React.useEffect(() => {
    if (!deleteLoading && deleteData) {
      setRefetchModel({
        variable: {
          ...refetchModel.variable,
          ...initPageinationVariable,
          first: refetchModel.paginationModel.pageSize,
        },
        paginationModel: {
          ...refetchModel.paginationModel,
          page: 0,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteLoading, deleteData]);

  // افکت برای بازجستجو داده‌ها هنگام تغییر مدل بازجستجو
  React.useEffect(() => {
    refetch(refetchModel.variable);
  }, [refetch, refetchModel]);

  return (
    <BasePage
      loading={pageLoading.current}
      pageTitle={t("form", "products")}
      maxWidth="lg"
      PageIcon={<TbCategory2 fontSize={24} />}
      ActionButton={ActionButton}
      error={error || deleteError || deleteData?.response.errors}
    >
      <PagePanel title={`${t("common", "list")} ${t("form", "product")} `}>
        <DataGridViewServer
          loading={loading}
          rows={data?.result.nodes ?? []}
          columns={columns}
          totalCount={data?.result.totalCount}
          gridPaginationModel={refetchModel.paginationModel}
          onPageChanged={handlePageChanged}
          onSortModelChange={handleSortModelChange}
          onFilterModelChange={handleFilterModelChange}
        />
        {/* پیغام برای نمایش خطا یا موفقیت در حذف فیلد برچسب */}
      </PagePanel>
    </BasePage>
  );
}
