import { useTranslation } from "@/providers/translation";
import { GridColDef } from "@mui/x-data-grid";

/**
 * * useCityColumns → Custom hook to define DataGrid columns for City table
 * ? Each column is internationalized using `useTranslation`
 */
const useCityColumns = (): GridColDef[] => {
  // Load translation from "form" namespace
  const { t } = useTranslation("form");

  // * DataGrid column definitions
  const columns: GridColDef[] = [
    {
      field: "province",
      headerName: t("form", "province-name"),
      width: 200,
      flex: 1,
      // ! Important: valueGetter extracts province.name instead of showing object
      valueGetter: (value: ProvinceType) => value.name,
    },
    {
      field: "name",
      headerName: t("form", "city-name"),
      width: 200,
      flex: 1,
    },
  ];
  return columns;
};

export default useCityColumns;
