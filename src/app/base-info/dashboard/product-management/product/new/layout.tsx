import { PROJECT_DESCRIPTION, PROJECT_TITLE } from "@/utils/constant";
import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

// *کامپوننت اصلی برای تعریف لایه‌بندی صفحه
const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  // *رندر فرزندان (children) بدون افزودن لایه‌بندی اضافی
  return <>{children}</>;
};

export default Layout;

// *متادیتا برای تنظیم عنوان و توضیحات صفحه
export const metadata: Metadata = {
  title: `${PROJECT_TITLE}  | افزودن محصول`,
  description: PROJECT_DESCRIPTION,
};
