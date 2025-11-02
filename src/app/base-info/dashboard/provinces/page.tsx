"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  BasePage,
  DeleteActionItem,
  EditActionItem,
  PagePanel,
  AddNewButton,
} from "@/components";
import { useTranslation } from "@/providers/translation";
import { DataGridViewServer, OnPageChangedProps } from "@/components/data-grid";
import {
  GridColDef,
  GridFilterModel,
  GridSortModel,
  GridRowId,
} from "@mui/x-data-grid";
import {
  initPageinationVariable,
  initPaginationModel,
  RefetchQueryModel,
} from "@/graphql/query-types";
import {
  AllProvincesFilter,
  AllProvincesOrder,
  allProvincesQuery,
  AllProvincesVariables,
  deleteProvinceMutation,
} from "./graphql";
import useProvinceColumns from "./columns";
import { FaMountainCity } from "react-icons/fa6";
import { formatString } from "@/utils";
import { useSearchParams } from "next/navigation";
import { useGridConfig } from "./grid-config";
import {
  buildSortOrder,
  buildFilterWhere,
  getRefetchModel,
} from "@/utils/data-Grid-Helpers";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useDialog } from "@/providers/dialog-provider/DialogProvider";
import { useMutation, useQuery } from "@apollo/client/react";

const ProvincesPage: React.FC = () => {
  const { t } = useTranslation("common", "form");
  const { show } = useAlert();
  const { show: showDialog, hide: hideDialog } = useDialog();
  const gridConfig = useGridConfig();
  const searchParams = useSearchParams();

  // 🧩 حذف استان
  const [
    deleteRecord,
    { data: deleteData, error: deleteError, loading: deleteLoading },
  ] = useMutation(deleteProvinceMutation, {
    fetchPolicy: "no-cache",
  });

  // 📦 تنظیم پارامترهای صفحه‌بندی
  const first = searchParams.get("first");
  const last = searchParams.get("last");
  const before = searchParams.get("before");
  const after = searchParams.get("after");

  initPageinationVariable.first = first
    ? parseInt(first)
    : initPaginationModel.pageSize;
  initPageinationVariable.last = last ? parseInt(last) : null;
  initPageinationVariable.before = before;
  initPageinationVariable.after = after;

  // 📄 مدل بازجستجو
  const [refetchModel, setRefetchModel] = useState<
    RefetchQueryModel<AllProvincesVariables>
  >({
    variable: {
      ...initPageinationVariable,
      where: null,
      order: [],
    },
    paginationModel: initPaginationModel,
  });

  const ActionButton = <AddNewButton href="provinces/new" />;

  // 🧠 گرفتن لیست استان‌ها
  const { loading, error, data, refetch } = useQuery(allProvincesQuery, {
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
    variables: refetchModel.variable,
  });

  // 🗑 تابع حذف استان
  const deleteProvince = React.useCallback(
    (id: GridRowId) => () => {
      showDialog(
        t("form", "province"),
        formatString(
          t("form", "delete-content-dialog"),
          t("form", "province")
        ),
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

  // 🧩 ستون‌های جدول
  const columns: GridColDef[] = [
    ...useProvinceColumns(),
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: ({ id }) => [
        <EditActionItem key={0} href={`provinces/${id}`} />,
        <DeleteActionItem key={1} onClick={deleteProvince(id)} rowId={1} />,
      ],
    },
  ];

  // 📊 مدیریت لودینگ صفحه
  const pageLoading = useRef<boolean>(true);
  if (loading) pageLoading.current = true;
  else if (!loading && pageLoading.current) pageLoading.current = false;

  // 📑 تغییر صفحه
  const handlePageChanged = (paginationModel: OnPageChangedProps) => {
    if (!data?.result?.pageInfo) return;
    const newModel = getRefetchModel(
      refetchModel,
      paginationModel,
      data.result.pageInfo
    );
    if (newModel) setRefetchModel(newModel);
  };

  // 🔽 مرتب‌سازی
  const handleSortModelChange = (sortModel: GridSortModel) => {
    const order = buildSortOrder<AllProvincesOrder>(sortModel, gridConfig.sort);
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

  // 🔍 فیلتر
  const handleFilterModelChange = (filterModel: GridFilterModel) => {
    const where = buildFilterWhere<AllProvincesFilter>(
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

  // ♻️ رفرش بعد از حذف
  useEffect(() => {
    if (!deleteLoading && deleteData) {
      const response = deleteData?.response;

      if (response?.errors?.length) {
        const backendMessage = response.errors[0]?.message;
        show({
          message: backendMessage,
          type: "error",
          autoHideDuration: 3000,
        });
      } else {
        show({
          message: formatString(t("common", "delete-successfully"), t("form", "province")),
          type: "success",
          autoHideDuration: 2000,
        });
      }

      setRefetchModel({
        variable: {
          ...refetchModel.variable,
          ...initPageinationVariable,
          first: refetchModel.paginationModel.pageSize,
        },
        paginationModel: { ...refetchModel.paginationModel, page: 0 },
      });
    }
    if (!deleteLoading && deleteError) {
      // Error: Show error message
      show({
        message: formatString(t("error", "delete-content-error"), t("form", "province")),
        type: "error",
        autoHideDuration: 2000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteLoading, deleteData, deleteError, t]);

  // 🔁 رفرش هنگام تغییر refetchModel
  useEffect(() => {
    refetch(refetchModel.variable);
  }, [refetchModel, refetch]);

  return (
    <BasePage
      loading={pageLoading.current}
      pageTitle={t("form", "provinces")}
      maxWidth="md"
      PageIcon={<FaMountainCity fontSize={24} />}
      ActionButton={ActionButton}
      error={error || deleteError || deleteData?.response.errors}
    >
      <PagePanel title={`${t("common","list")} ${t('form', 'provinces')} `}>
        <DataGridViewServer
          loading={loading}
          rows={data?.result.nodes ?? []}
          columns={columns}
          totalCount={data?.result?.totalCount}
          gridPaginationModel={refetchModel.paginationModel}
          onPageChanged={handlePageChanged}
          onSortModelChange={handleSortModelChange}
          onFilterModelChange={handleFilterModelChange}
        />
      </PagePanel>
    </BasePage>
  );
};

export default ProvincesPage;
