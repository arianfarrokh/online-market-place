"use client";
import React from "react";
import { BasePage } from "@/components";
import { useTranslation } from "@/providers/translation"; // ✅ مسیر درست هوک ترجمه
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import FeatureForm from "../feature-form";

// ✅ مقادیر اولیه برای فرم ویژگی جدید
const initData: FeatureType = {
  id: 0,
  name: "",
  value: "",
  status: "ACTIVE",
};

const NewFeaturePage = () => {
  const { t } = useTranslation("common", "form");

  // ✅ تابع ساختگی موقت برای جلوگیری از ارور
  const handleSave = (data: FeatureType) => {
    console.log("Feature saved (test mode):", data);
  };

  return (
    <BasePage
      pageTitle={`${t('common', 'add-new')} ${t("form","feature")}`}
      maxWidth="md"
      PageIcon={<MdOutlineFeaturedPlayList fontSize={24} />}
    >
      <FeatureForm feature={initData} onSave={handleSave} />
    </BasePage>
  );
};

export default NewFeaturePage;
