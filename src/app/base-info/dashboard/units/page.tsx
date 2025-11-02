"use client";
import React, { useRef } from "react";
import {
  BasePage,
  DeleteActionItem,
  EditActionItem,
  PagePanel,
  AddNewButton,
} from "@/components";
import { DataGridViewServer, OnPageChangedProps } from "@/components/data-grid";
import {
  GridColDef,
  GridFilterModel,
  GridRowId,
  GridSortModel,
} from "@mui/x-data-grid";
import { useMutation, useQuery } from "@apollo/client/react";
import { TbCategory2 } from "react-icons/tb";
import { formatString } from "@/utils";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useDialog } from "@/providers/dialog-provider/DialogProvider";
import useUnitColumns from "./columns";
import {
  AllUnitsFilter,
  AllUnitsOrder,
  allUnitsQuery,
  AllUnitsVariables,
  deleteUnitMutation,
} from "./graphql";
import {
  initPageinationVariable,
  initPaginationModel,
  RefetchQueryModel,
} from "@/graphql/query-types";
import { useGridConfig } from "./grid-config";
import {
  buildSortOrder,
  buildFilterWhere,
  getRefetchModel,
} from "@/utils/data-Grid-Helpers";
import { useTranslation } from "@/providers/translation";

const UnitsPage: React.FC = () => {
  const { t } = useTranslation("common", "form");
  const { show } = useAlert();
  const { show: showDialog, hide: hideDialog } = useDialog();
  const gridConfig = useGridConfig();
  const pageLoading = useRef<boolean>(true);

  // Mutation for deleting units
  const [deleteRecord] = useMutation(deleteUnitMutation, {
    fetchPolicy: "no-cache",
  });

  // State for pagination & refetch
  const [refetchModel, setRefetchModel] = React.useState<
    RefetchQueryModel<AllUnitsVariables>
  >({
    variable: {
      ...initPageinationVariable,
      first: initPaginationModel.pageSize,
      where: null,
      order: [],
    },
    paginationModel: initPaginationModel,
  });

  const ActionButton = <AddNewButton href="units/new" />;

  // Query all units
  const { loading, data, refetch } = useQuery(allUnitsQuery, {
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
    variables: refetchModel.variable,
  });

  pageLoading.current = loading;

  // Delete handler
  const deleteUnit = React.useCallback(
    (id: GridRowId) => async () => {
      showDialog(
        t("common", "unit"),
        formatString(t("form", "delete-content-dialog"), t("common", "unit")),
        {
          maxWidth: "xs",
          confirmText: t("common", "delete"),
          cancelText: t("common", "cancel"),
          onConfirm: async () => {
            try {
              const { data } = await deleteRecord({
                variables: { id: id as number },
              });

              const errors = data?.response?.errors;

              if (errors && errors.length > 0) {
                // Backend returned errors
                show({
                  type: "error",
                  message:
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    errors.map((e: any) => e.message).join(", ") ||
                    t("error", "delete-content-error"),
                  autoHideDuration: 3000,
                });
              } else if (data?.response?.result) {
                // Success
                show({
                  type: "success",
                  message: formatString(
                    t("common", "delete-successfully"),
                    t("form", "unit")
                  ),
                  autoHideDuration: 3000,
                });

                // Refetch the grid after successful delete
                refetch(refetchModel.variable);
              } else {
                // Unexpected case
                show({
                  type: "error",
                  message: t("error", "delete-content-error"),
                  autoHideDuration: 3000,
                });
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
              show({
                type: "error",
                message: err.message || t("error", "delete-content-error"),
                autoHideDuration: 3000,
              });
            } finally {
              hideDialog();
            }
          },
          onCancel: hideDialog,
        }
      );
    },
    [deleteRecord, showDialog, hideDialog, t, show, refetch, refetchModel]
  );

  // Columns
  const columns: GridColDef[] = [
    ...useUnitColumns(),
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: ({ id }) => [
        <EditActionItem key="edit" href={`units/${id}`} />,
        <DeleteActionItem key={0} onClick={deleteUnit(id)} rowId={1} />,
      ],
    },
  ];

  // Page change handler
  const handlePageChanged = (paginationModel: OnPageChangedProps) => {
    if (!data) return;
    const newModel = getRefetchModel(
      refetchModel,
      paginationModel,
      data.result.pageInfo
    );
    if (newModel) setRefetchModel(newModel);
  };

  // Sort handler
  const handleSortModelChange = (sortModel: GridSortModel) => {
    const order = buildSortOrder<AllUnitsOrder>(sortModel, gridConfig.sort);
    setRefetchModel({
      paginationModel: { ...refetchModel.paginationModel },
      variable: {
        ...refetchModel.variable,
        ...initPageinationVariable,
        first: refetchModel.paginationModel.pageSize,
        order: order.length ? [order[0]] : [],
      },
    });
  };

  // Filter handler
  const handleFilterModelChange = (filterModel: GridFilterModel) => {
    const rawWhere = buildFilterWhere<AllUnitsFilter>(
      filterModel,
      gridConfig.filter,
      filterModel.logicOperator === "and" ? "and" : "or"
    );

    let where: { and: AllUnitsFilter[] } | { or: AllUnitsFilter[] } | null =
      null;
    if (rawWhere) {
      if ("and" in rawWhere && Array.isArray(rawWhere.and)) {
        const andArr = rawWhere.and.filter(Boolean) as AllUnitsFilter[];
        if (andArr.length > 0) where = { and: andArr };
      } else if ("or" in rawWhere && Array.isArray(rawWhere.or)) {
        const orArr = rawWhere.or.filter(Boolean) as AllUnitsFilter[];
        if (orArr.length > 0) where = { or: orArr };
      }
    }

    setRefetchModel({
      paginationModel: { ...refetchModel.paginationModel },
      variable: {
        ...refetchModel.variable,
        ...initPageinationVariable,
        first: refetchModel.paginationModel.pageSize,
        where,
        order: refetchModel.variable.order || [],
      },
    });
  };

  return (
    <BasePage
      loading={pageLoading.current}
      pageTitle={t("form", "units")}
      maxWidth="md"
      PageIcon={<TbCategory2 fontSize={24} />}
      ActionButton={ActionButton}
    >
      <PagePanel title={`${t("common", "list")} ${t("form", "units")} `}>
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
      </PagePanel>
    </BasePage>
  );
};

export default UnitsPage;
