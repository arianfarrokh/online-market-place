import React from "react";
import { LinearProgress, Typography, Box } from "@mui/material";
import { useTranslation } from "@/providers/translation";

type Props = {
  progress: number;
};

const UploadProgress = ({ progress }: Props) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ width: "100%", mt: 2, textAlign: "center" }}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {t("form", "Uploading...")}
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
    </Box>
  );
};

export default UploadProgress;