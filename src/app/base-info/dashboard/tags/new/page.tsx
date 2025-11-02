"use client";
import { BasePage } from "@/components";
import { useTranslation } from "@/providers/translation";
import React from "react";
import { TbCategory2 } from "react-icons/tb";
// import { BiSolidCategoryAlt } from "react-icons/bi";
import TagForm from "../tag-form";
import { addNewTagMutation } from "../graphql";
import { useRouter } from "next/navigation";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useMutation } from "@apollo/client/react";
import { formatString } from "@/utils";


// مقادیر اولیه برای فرم برچسب جدید
const initData: TagType = {
  id: 0,
  name: "",
  status: "ACTIVE",
};

// کامپوننت اصلی برای صفحه افزودن برچسب جدید
const NewTagPage = () => {
  // هوک ترجمه برای پشتیبانی از چندزبانه بودن
  const { t } = useTranslation("common", "form", "error");
  // هوک روتر برای مدیریت ناوبری
  const router = useRouter();

  const { show } = useAlert();

  // هوک میوتیشن برای افزودن برچسب جدید
  const [addNewRecord, { loading , data, error }] = useMutation(
    addNewTagMutation,
    {
      fetchPolicy: "no-cache",

    }
  );

    React.useEffect(() => {
      if (!loading && data) {
        show({
          message: formatString(t("common" , "add-successfully") , t("form", "tag")) ,
          type: "success",
          autoHideDuration: 3000,
        });
        router.back();
      }
      if (!loading && error) {
        show({
          message: formatString(t("error" , "failed-to-add") , t("form", "tag")) ,
          type: "error",
          autoHideDuration: 3000,
        });
      }
    }, [data, error, loading, router, show, t]);

  // تابع برای مدیریت ذخیره برچسب جدید
  const handleSave = (data: TagType) => {
    addNewRecord({
      variables: {
        input: {
          name: data.name,
          status: data.status,
        },
      },
    });
  };

  return (
    <BasePage
      pageTitle={` ${t("common", "add-new")} ${t("form" , "tag")}  `}  // عنوان صفحه
      maxWidth="lg"
      PageIcon={<TbCategory2 fontSize={24} />}
      error={error || data?.response.errors} // نمایش خطاها
    >
      {/* پیغام برای نمایش خطا یا موفقیت در اضافه کردن برچسب */}

      <TagForm tag={initData} onSave={handleSave} />
    </BasePage>
  );
};

export default NewTagPage;
