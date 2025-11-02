"use client";
import React, { useRef } from "react";
import {
  BasePage,
  PagePanel,
  AddNewButton,
} from "@/components";
import { useTranslation } from "@/providers/translation";
import { DataGridViewServer } from "@/components/data-grid";
import { MdFeaturedPlayList } from "react-icons/md";
import useFeatureColumns from "./columns";
import { GridColDef } from "@mui/x-data-grid";

const FeaturesPage: React.FC = () => {
  const { t } = useTranslation("common", "form");
  const pageLoading = useRef<boolean>(false);
  const ActionButton = <AddNewButton href="features/new" />;
  // تعریف ستون‌های جدول داده
  const columns: GridColDef[] = [
    ...useFeatureColumns(),
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: ({ }) => [
        // <EditActionItem key={0} href={`tags/${id}`} />,
        // //  * Delete action
        // <DeleteActionItem key={1} onClick={deleteTag(id)} />,
      ],
    },
  ];
  return (
    <BasePage
      loading={pageLoading.current}
      pageTitle={t("form", "features")}
      maxWidth="md"
      PageIcon={<MdFeaturedPlayList fontSize={24} />}
      ActionButton={ActionButton}
    >
      <PagePanel title={t('form', 'products-features')}>
        <DataGridViewServer
          loading={false}
          rows={[]} // داده‌ها خالی برای شروع
          columns={columns} // بدون ستون
          totalCount={0}
          gridPaginationModel={{
            page: 0,
            pageSize: 10,
          }}
          onPageChanged={() => {}}
          onSortModelChange={() => {}}
          onFilterModelChange={() => {}}
        />
      </PagePanel>
    </BasePage>
  );
};

export default FeaturesPage;
