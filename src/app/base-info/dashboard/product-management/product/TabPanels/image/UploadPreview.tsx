import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { useTranslation } from "@/providers/translation";
import { MdOutlineDelete } from "react-icons/md";

type Props = {
  imageUrl: string;
  onClose: () => void;
};

const UploadPreview = ({ imageUrl, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ textAlign: "center", position: "relative" }}>
      {/* دکمه بستن بالا گوشه */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: { xs: 0, sm: 4, md: 6 },
          right: { xs: 0, sm: 4, md: 6 },
          color: "#ff000077",
          "&:hover": { color: "#ff0000ff" },
        }}
      >
        <MdOutlineDelete />
      </IconButton>
      <Box
        sx={{
          fontSize: { xs: 20, sm: 25, md: 40 },
        }}
      >
        <FaCheckCircle color="green" />
      </Box>
      <Typography fontSize={{ xs: 15, sm: 20, md: 25 }} mt={1} mb={2}>
        {t("form", "Photo-received-successfully")}
      </Typography>
      <Box
        sx={{
          width: { xs: 150, sm: 200, md: 400 },
          height: { xs: 100, sm: 100, md: 250 },
          position: "relative",
          mx: "auto",
          mb: 2,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        <Image
          alt="uploaded image"
          src={imageUrl}
          fill
          style={{ objectFit: "cover" }}
          onError={() => onClose()} // در صورت خطا در لود تصویر، ریست کن
        />
      </Box>
    </Box>
  );
};

export default UploadPreview;
