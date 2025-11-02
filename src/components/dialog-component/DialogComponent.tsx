"use client";
import React from "react";
import { DialogProps } from "../../providers/dialog-provider/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const DialogComponent: React.FC<DialogProps> = ({
  open,
  onCancel,
  onConfirm,
  maxWidth,
  title,
  content,
  cancelText,
  confirmText,
}) => {
    
  return (
    <Dialog open={open} onClose={onCancel} maxWidth={maxWidth} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        {cancelText && (
          <Button variant="contained" color="error" onClick={onCancel}>
            {cancelText}
          </Button>
        )}
        {confirmText && cancelText && (
          <Button variant="contained" color="success" onClick={onConfirm}>
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
