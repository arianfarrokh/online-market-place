"use client";

import React from "react";
import { BasePage } from "@/components";
import FeatureForm from "../feature-form";
import { useRouter } from "next/navigation";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useTranslation } from "@/providers/translation";
import { formatString } from "@/utils";

type Props = {
  params: { id: string };
};

// ✅ داده اولیه برای فرم ویژگی
const initData: FeatureType = {
  id: 0,
  name: "",
  value: "",
  status: "ACTIVE",
};

const EditFeaturesPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const { t } = useTranslation("error", "common", "form");
  const { show } = useAlert();
  const router = useRouter();

  const [feature, setFeature] = React.useState<FeatureType>(initData);

  // ✅ شبیه‌سازی واکشی داده از سرور
  React.useEffect(() => {
    // این فقط برای تست UI هست
    const fakeFeature: FeatureType = {
      id: parseInt(id),
      name: "طول کابل",
      value: "2 متر",
      status: "ACTIVE",
    };
    setFeature(fakeFeature);
  }, [id]);

  // ✅ تابع ذخیره (فعلاً فقط پیام نشون می‌ده)
  const handleSave = () => {
    show({
      message: formatString(
        t("common", "update-successfully"),
        t("form", "feature")
      ),
      type: "success",
      autoHideDuration: 4000,
    });
    router.back();
  };

  return (
    <BasePage
      pageTitle={`${t('common', 'edit')} ${t("form","feature")}`}
      maxWidth="md"
    >
      <FeatureForm feature={feature} onSave={handleSave} />
    </BasePage>
  );
};

export default EditFeaturesPage;
