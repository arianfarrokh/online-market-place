import { useTranslation } from "@/providers/translation";
import { Chip, Avatar } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { ImBlocked } from "react-icons/im";
import { CiBookmarkCheck } from "react-icons/ci";
import { useActiveStatusMap } from "@/hooks/enums-mappers";
import { singleSelectOperators } from "@/components/data-grid";

// *هوک برای تعریف ستون‌های جدول محصولات
const useProductColumns = (): GridColDef[] => {
  // *هوک ترجمه برای پشتیبانی از چندزبانه بودن
  const { t } = useTranslation("form");
  const activeStatusMap = useActiveStatusMap();

  // *تعریف ستون‌های جدول
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: t("form", "product-id"), 
      width: 100,
      flex: 0.5,
    },
    {
      field: "image",
      headerName: t("form", "image"), 
      width: 80,
      renderCell: ({ value }: GridRenderCellParams) => (
        <Avatar
          src={value}
          alt="product-image"
          sx={{ width: 40, height: 40 }}
        />
      ),
    },
    {
      field: "name",
      headerName: t("form", "product-name"),
      width: 200,
      flex: 1,
    },
    {
      field: "price",
      headerName: t("form", "price"),
      width: 120,
      type: "number",
      // *  valueFormatter: ({ value }) => (value ? `${value} ${t("form", "currency")}` : ""),
    },
    {
      field: "status",
      headerName: t("common", "status"), // *وضعیت
      width: 120,
      type: "singleSelect",
      valueOptions: () => activeStatusMap.valuesArray(),
      filterOperators: singleSelectOperators,
      renderCell: ({ value }: GridRenderCellParams) => {
        if (value) {
          const label = t("form", value); 
          let color: "success" | "error";
          let icon: React.ReactNode; 

          if (value === "ACTIVE") {
            color = "success";
            icon = <CiBookmarkCheck />;
          } else {
            color = "error";
            icon = <ImBlocked />;
          }

          return <Chip label={label} color={color} size="small" icon={icon} />;
        }
      },
    },
    {
      field: "stock",
      headerName: t("form", "stock"),
      width: 100,
      type: "number",
    },
    {
      field: "createdAt",
      headerName: t("form", "created-at"), 
      width: 150,
      type: "dateTime",
      // *  valueFormatter: ({ value }) => (value ? new Date(value).toLocaleDateString() : ""),
    },
  ];

  return columns;
};

export default useProductColumns;
