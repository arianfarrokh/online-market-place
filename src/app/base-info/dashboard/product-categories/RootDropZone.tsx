import React from "react";
import { Paper, Typography } from "@mui/material";
import { useDrop } from "react-dnd";
import { useTranslation } from "@/providers/translation";
import { formatString } from "@/utils";

const ITEM_TYPE = "CATEGORY";

type RootDropZoneProps = {
  onDrop: (dragId: number, dropId: number | null) => void;
};

export const RootDropZone: React.FC<RootDropZoneProps> = ({ onDrop }) => {
  const { t } = useTranslation("common");

  const [{ isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { id: number }) => onDrop(item.id, null),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <div ref={dropRef as any}>
      <Paper 
        sx={{      
          p: 2,
          mb: 2,
          textAlign: "center",
          border: `2px dashed ${isOver ? "primary.main" : "grey.300"}`,
          borderRadius: 2,
          backgroundColor: isOver ? "action.hover" : "background.paper",
          cursor: "pointer",
          opacity: isOver ? 0.7 : 1,
        }}
      >
        <Typography  variant="body2" color="text.secondary">
          {formatString(t("common", "drop-here-to-root"),t("form","product-category"))}
        </Typography>
      </Paper>
    </div>
  );
};