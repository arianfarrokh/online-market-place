"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import UploadPreview from "./UploadPreview";
import { useTranslation } from "@/providers/translation";
import { FormikProps } from "formik";
import { ProductType } from "../../type";
import UploadProgress from "./UploadProgress";
import { RiDragDropLine } from "react-icons/ri";


interface Props {
  formik: FormikProps<ProductType>;
}

const ImageUploader = ({ formik }: Props) => {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  const { t } = useTranslation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ذخیره فایل و پیش‌نمایش در Formik
    formik.setFieldValue("image", file);
    formik.setFieldValue("imagePreview", URL.createObjectURL(file));

    // شبیه‌سازی آپلود
    setUploading(true);
    setProgress(10);
    const fakeUpload = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(fakeUpload);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // ذخیره فایل و پیش‌نمایش در Formik
    formik.setFieldValue("image", file);
    formik.setFieldValue("imagePreview", URL.createObjectURL(file));

    setUploading(true);
    setProgress(10);
    const fakeUpload = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(fakeUpload);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  

  const handleReset = () => {
    // ریست کردن فیلدهای تصویر در Formik
    formik.setFieldValue("image", "");
    formik.setFieldValue("imagePreview", "");
    setProgress(0);
    setUploading(false);
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      sx={{
        width: { xs: 200, sm: 400, md: 800 },
        height: { xs: 300, sm: 300, md: 450 },
        mx: "auto",
        p: 3,
        boxShadow: "0 0 10px",
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      {!uploading && !formik.values.imagePreview && (
        <>
          <Typography
            fontSize={{ xs: "0.8rem", sm: "1.2rem", md: "1.5rem" }}
            mb={1}
            mt={{xs:10 , sm:10 , md:15}}
          >
            {t("common", "drag-drop")}
          </Typography>
          <Box
            sx={{
              fontSize: { xs: 40, sm: 50, md: 65, lg: 80 },
            }}
            component="label"
            style={{ cursor: "pointer", display: "inline-block" }}
          >
            <RiDragDropLine color="#ff9900" />
            <input
              type="file"
              accept="image/jpeg,image/png"
              hidden
              onChange={handleFileChange}
            />
          </Box>
        </>
      )}

      {uploading && <UploadProgress progress={progress} />}

      {formik.values.imagePreview && !uploading && (
        <UploadPreview
          imageUrl={formik.values.imagePreview}
          onClose={handleReset}
        />
      )}
    </Box>
  );
};

export default ImageUploader;
