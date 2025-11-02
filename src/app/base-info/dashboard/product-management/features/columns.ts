import { useTranslation } from "@/providers/translation";
import { GridColDef } from "@mui/x-data-grid";
/**
 * * useFeaturesColumns → Custom hook to define DataGrid columns for Feature table
 * ? Each column is internationalized using `useTranslation`
 */
const useFeatureColumns = (): GridColDef[] => {
  // Load translation from "form" namespace
  const { t } = useTranslation("form","common");
  // * DataGrid column definitions

  const columns: GridColDef[] = [
    {
      field: "feature",
      headerName: t("form", "feature"),
      width: 200,
      flex: 1,
    },
    {
      field: "value",
      headerName: t("common", "value"),
      width: 150,
    },
  ];
  return columns;
};

export default useFeatureColumns;
