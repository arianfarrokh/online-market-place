"use client";
import React from "react";
import {
  BasePage,
  DeleteActionItem,
  EditActionItem,
  PagePanel,
} from "@/components";
import { useTranslation } from "@/providers/translation";
import { AddNewButton } from "@/components";
import { DataGridViewServer, OnPageChangedProps } from "@/components/data-grid";
import {
  GridColDef,
  GridFilterModel,
  GridRowId,
  GridSortModel,
} from "@mui/x-data-grid";
import {
  initPageinationVariable,
  initPaginationModel,
  RefetchQueryModel,
} from "@/graphql/query-types";
import {
  AllColorsFilter,
  AllColorsOrder,
  allColorsQuery,
  AllColorsVariables,
  deleteColorMutation,
} from "./graphql";
import useColorColumns from "./columns";
import { TbCategory2 } from "react-icons/tb";
import { formatString } from "@/utils";
import {
  buildFilterWhere,
  buildSortOrder,
  getRefetchModel,
} from "@/utils/data-Grid-Helpers";
import { useGridConfig } from "./grid-config";
import { useDialog } from "@/providers/dialog-provider/DialogProvider"; // ✅ Added
import { useMutation, useQuery } from "@apollo/client/react";
import { useAlert } from "@/providers/alert-provider/AlertProvider";

const ColorsPage: React.FC = () => {
  const { t } = useTranslation("common", "form");
  const gridConfig = useGridConfig();

  const { show: showDialog, hide: hideDialog } = useDialog();
  const { show } = useAlert();

  const [
    deleteRecord,
    { data: deleteData, error: deleteError, loading: deleteLoading },
  ] = useMutation(deleteColorMutation, {
    // onCompleted: () => {
    //   show({type:'success' , autoHideDuration:3000, message: t("form", "delete-color-success")})
    // },
    // onError: (error) => {
    //   show({type:"error", autoHideDuration:4000 , message: t("error", "delete-color-error") || error.message })
    // },
    fetchPolicy: "no-cache",
  });

  const [refetchModel, setRefetchModel] = React.useState<
    RefetchQueryModel<AllColorsVariables>
  >({
    variable: {
      ...initPageinationVariable,
      first: initPaginationModel.pageSize,
      where: null,
      order: [],
    },
    paginationModel: initPaginationModel,
  });

  const ActionButton = <AddNewButton href="colors/new" />;

  const { loading, error, data, refetch } = useQuery(allColorsQuery, {
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
    variables: refetchModel.variable,
  });

  // ✅ Updated deleteColor to use dialog
  const deleteColor = React.useCallback(
    (id: GridRowId) => () => {
      showDialog(
        t("form", "color"),
        formatString(t("form", "delete-content-dialog"), t("form", "color")),
        {
          maxWidth: "xs",
          confirmText: t("common", "delete"),
          cancelText: t("common", "cancel"),
          onConfirm: () => {
            deleteRecord({
              variables: {
                id: id as number,
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

  const columns: GridColDef[] = [
    ...useColorColumns(),
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: ({ id }) => [
        <EditActionItem key={0} href={`colors/${id}`} />,
        <DeleteActionItem rowId={0} key={1} onClick={deleteColor(id)} />, // ✅ simplified to onClick (dialog opens)
      ],
    },
  ];

 
const [initialLoading, setInitialLoading] = React.useState(true);

// Runs only once — hides BasePage loader after first successful load
React.useEffect(() => {
  if (!loading && data && initialLoading) {
    setInitialLoading(false);
  }
}, [loading, data, initialLoading]);


  const handlePageChanged = (paginationModel: OnPageChangedProps) => {
    if (!data) return;
    const newModel = getRefetchModel(
      refetchModel,
      paginationModel,
      data.result.pageInfo
    );
    if (newModel) setRefetchModel(newModel);
  };

  const handleSortModelChange = (sortModel: GridSortModel) => {
    const order = buildSortOrder<AllColorsOrder>(sortModel, gridConfig.sort);
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

  const handleFilterModelChange = (filterModel: GridFilterModel) => {
    const where = buildFilterWhere<AllColorsFilter>(
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

  React.useEffect(() => {
    if (!deleteLoading && deleteData) {
      const response = deleteData?.response;

      if (response?.errors && response.errors.length > 0) {
        const backendMessage = response.errors[0].message;
        show({
          type: "error",
          autoHideDuration: 3000,
          message: backendMessage,
        });
      } else {
        show({
          type: "success",
          autoHideDuration: 3000,
          message: formatString(t("common", "delete-successfully"),t("form","color")),
        });
      }

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
      if (!deleteLoading && deleteError) {
        show({
          type: "error",
          autoHideDuration: 4000,
          message: formatString(t("error", "delete-content-error"),t("form","color")) || deleteError.message,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteLoading, deleteData]);

  React.useEffect(() => {
    refetch(refetchModel.variable);
  }, [refetch, refetchModel]);

  return (
    <BasePage
      loading={initialLoading}
      pageTitle={t("form", "colors")}
      maxWidth="md"
      PageIcon={<TbCategory2 fontSize={24} />}
      ActionButton={ActionButton}
      error={error || deleteError || deleteData?.response.errors}
    >
      <PagePanel title={`${t("common","list")} ${t("form","colors")}`}>
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

export default ColorsPage;
