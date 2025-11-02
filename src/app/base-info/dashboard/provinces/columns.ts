import { useTranslation } from "@/providers/translation";
import { GridColDef } from "@mui/x-data-grid";
/**
 * * useProvinceColumns → Custom hook to define DataGrid columns for Province table
 * ? Each column is internationalized using `useTranslation`
 */
const useProvinceColumns = (): GridColDef[] => {
  // Load translation from "form" namespace
  const { t } = useTranslation("form");
  // * DataGrid column definitions

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("form", "name"),
      width: 200,
      flex: 1,
    },
    {
      field: "prefixNumber",
      headerName: t("form", "prefix-number"),
      width: 150,
    },
  ];
  return columns;
};

export default useProvinceColumns;
