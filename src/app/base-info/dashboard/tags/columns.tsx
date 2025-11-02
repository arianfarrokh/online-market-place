import { useTranslation } from "@/providers/translation";
import { Chip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { ImBlocked } from "react-icons/im";
import { CiBookmarkCheck } from "react-icons/ci";
import { useActiveStatusMap } from "@/hooks/enums-mappers";
import { singleSelectOperators } from "@/components/data-grid";

// هوک برای تعریف ستون‌های جدول برچسب‌ها
const useCityColumns = (): GridColDef[] => {
  // هوک ترجمه برای پشتیبانی از چندزبانه بودن
  const { t } = useTranslation("form");
  const activeStatusMap = useActiveStatusMap();
  // تعریف ستون‌های جدول
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("form", "tag-name"), // عنوان ستون برای نام برچسب
      width: 200,
      flex: 1,
    },
    {
      field: "status",
      headerName: t("common", "status"), // عنوان ستون برای وضعیت
      width: 100,
      type: "singleSelect",
      valueOptions: () => activeStatusMap.valuesArray(),
      filterOperators: singleSelectOperators,
      // تابع برای رندر سلول وضعیت
      renderCell({ value }: GridRenderCellParams<TagType, ActiveStatusType>) {
        if (value) {
          const label = t("enum", value); // برچسب ترجمه‌شده برای وضعیت
          let color: "success" | "error"; // رنگ برای کامپوننت Chip
          let icon: React.ReactNode; // آیکون برای کامپوننت Chip

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
  ];
  return columns;
};

export default useCityColumns;
