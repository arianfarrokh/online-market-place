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
  AllCitiesFilter,
  AllCitiesOrder,
  allCitiesQuery,
  AllCitiesVariables,
  deleteCityMutation,
} from "./graphql";
import useCityColumns from "./columns";
import { FaMountainCity } from "react-icons/fa6";
import { formatString } from "@/utils";
import {
  buildFilterWhere,
  buildSortOrder,
  getRefetchModel,
} from "@/utils/data-Grid-Helpers";
import { useGridConfig } from "./grid-config";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useDialog } from "@/providers/dialog-provider/DialogProvider";
import { useMutation, useQuery } from "@apollo/client/react";
// * Cities Management Page (CRUD with pagination, filtering, sorting)

const CitiesPage: React.FC = () => {
  //*translation hook (common & form namespaces)
  const { t } = useTranslation("common", "form");

  // * useAlert hook
  const { show } = useAlert();
  //*  useDialogue
  const { show: showDialog, hide: hideDialog } = useDialog();

  const gridConfig = useGridConfig();

  //*delete city mutation
  const [
    deleteRecord,
    { data: deleteData, error: deleteError, loading: deleteLoading },
  ] = useMutation(deleteCityMutation, {
    fetchPolicy: "no-cache",
  });

  // * Query state (pagination , filters , sort)
  const [refetchModel, setRefetchModel] = React.useState<
    RefetchQueryModel<AllCitiesVariables>
  >({
    variable: {
      ...initPageinationVariable,
      first: initPaginationModel.pageSize,
      where: null,
      order: [],
    },
    paginationModel: initPaginationModel,
  });

  // * action button for creating city
  const ActionButton = <AddNewButton href="cities/new" />;

  // * Query: Fetch cities from graphql
  const { loading, error, data, refetch } = useQuery(allCitiesQuery, {
    // context: authContext(),
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
    variables: refetchModel.variable,
  });

  // * delete city handler
  const deleteCity = React.useCallback(
    (id: GridRowId) => () => {
      showDialog(
        t("form", "city"),
        formatString(t("form", "delete-content-dialog"), t("form", "city")),
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

  //  * datagrid columns defenition
  const columns: GridColDef[] = [
    ...useCityColumns(),
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: ({ id }) => [
        //  * Edit action
        <EditActionItem
          key={0}
          // showInMenu
          href={`cities/${id}`}
        />,
        //  * Delete action
        <DeleteActionItem rowId={0} key={1} onClick={deleteCity(id)} />,
      ],
    },
  ];

  // * page loading
  const pageLoading = React.useRef<boolean>(false);
  if (loading) {
    pageLoading.current = true;
  } else if (!loading && pageLoading.current) {
    pageLoading.current = false;
  }

  // * Handle pagination change  (next/prev + page size change)
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

  const handleSortModelChange = (sortModel: GridSortModel) => {
    const order = buildSortOrder<AllCitiesOrder>(sortModel, gridConfig.sort);

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

  //handle filter model

  const handleFilterModelChange = (filterModel: GridFilterModel) => {
    const where = buildFilterWhere<AllCitiesFilter>(
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
  // * refresh after deletion success
  React.useEffect(() => {
    if (!deleteLoading && deleteData) {
      // Success: Show success message and reset pagination
      show({
        message: formatString(
          t("common", "delete-successfully"),
          t("form", "city")
        ),
        type: "success",
        autoHideDuration: 3000,
      });
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
    if (!deleteLoading && deleteError) {
      // Error: Show error message
      show({
        message:
          formatString(t("error", "delete-content-error"), t("form", "city")) ||
          deleteError.message,
        type: "error",
        autoHideDuration: 3000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteLoading, deleteData, deleteError, t]);

  // * refetch data when refetchModel changes
  React.useEffect(() => {
    refetch(refetchModel.variable);
  }, [refetch, refetchModel]);

  return (
    <BasePage
      pageTitle={t("form", "cities")}
      maxWidth="md"
      loading={pageLoading.current}
      PageIcon={<FaMountainCity fontSize={24} />}
      ActionButton={ActionButton}
      error={error || deleteError || deleteData?.response.errors}
    >
      <PagePanel title={`${t("common", "list")} ${t("form", "cities")}`}>
        <DataGridViewServer
          loading={loading}
          // rows={rows}
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

export default CitiesPage;
