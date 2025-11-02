"use client";

import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { TbChevronDown, TbChevronLeft, TbPlus } from "react-icons/tb";
import { useDrag, useDrop } from "react-dnd";
import { DeleteActionItem, EditActionItem } from "@/components";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import { useDialog } from "@/providers/dialog-provider/DialogProvider";
import { useTranslation } from "@/providers/translation";
import { deleteProductCategoryMutation } from "./graphql";
import { getAllDescendantIds, removeNodeFromTree } from "./TreeHelpers";
import { useMutation } from "@apollo/client/react";
import { formatString } from "@/utils";

const ITEM_TYPE = "CATEGORY";

type TreeNodeProps = {
  node: ProductCategoryType;
  level: number;
  onDrop: (dragId: number, dropId: number | null) => void;
  onToggleExpand: (id: number) => void;
  expandedIds: Set<number>;
  treeData: ProductCategoryType[];
  setTreeData: React.Dispatch<React.SetStateAction<ProductCategoryType[]>>;
  router: AppRouterInstance;
};

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  onDrop,
  onToggleExpand,
  expandedIds,
  treeData,
  setTreeData,
  router,
}) => {
  const { t } = useTranslation("common", "form", "error");
  const { show } = useAlert();
  const { show: showDialog, hide: hideDialog } = useDialog();
  const [deleteCategory] = useMutation(deleteProductCategoryMutation);

  const isExpanded = expandedIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const descendantIds = getAllDescendantIds(node);

  const [{ isDragging, draggedId }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { id: node.id, allIds: [node.id, ...descendantIds] },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      draggedId: monitor.getItem()?.id,
    }),
  });

  const [, dropRef] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { id: number }) => onDrop(item.id, node.id),
  });

  const combinedRef = (el: HTMLDivElement) => {
    dragRef(el);
    dropRef(el);
  };

  const isDraggedBranch =
    isDragging || draggedId === node.id || descendantIds.includes(draggedId!);

  // ---------------- Delete logic ----------------
  const handleDelete = () => {
    showDialog(
      t("form", "product-categories"),
      formatString(
        t("form", "delete-content-dialog"),
        t("form", "product-category")
      ),
      {
        maxWidth: "xs",
        confirmText: t("common", "delete"),
        cancelText: t("common", "cancel"),
        onConfirm: async () => {
          hideDialog();

          if (hasChildren) {
            show({
              message: t("error", "cannot-delete-with-children"),
              type: "error",
              autoHideDuration: 3000,
            });
            return;
          }

          try {
            const { data } = await deleteCategory({
              variables: { id: node.id },
            });

            const errors = data?.response?.errors;
            if (errors && errors.length > 0) {
              show({
                message:
                  errors[0].message ||
                  formatString(
                    t("error", "delete-content-error"),
                    t("form", "product-category")
                  ),
                type: "error",
                autoHideDuration: 3000,
              });
              return;
            }

            const result = data?.response?.result;
            if (!result) {
              show({
                message: formatString(
                  t("error", "delete-content-error"),
                  t("form", "product-category")
                ),
                type: "error",
                autoHideDuration: 3000,
              });
              return;
            }

            setTreeData((prevTree) => {
              const newTree = JSON.parse(JSON.stringify(prevTree));
              removeNodeFromTree(newTree, node.id);
              return newTree;
            });

            show({
              message: t("form", "delete-category-success"),
              type: "success",
              autoHideDuration: 2000,
            });
          } catch (err) {
            console.error(err);
            show({
              message: formatString(
                t("error", "delete-content-error"),
                t("form", "product-category")
              ),
              type: "error",
              autoHideDuration: 3000,
            });
          }
        },
        onCancel: hideDialog,
      }
    );
  };

  // ---------------- Render Node ----------------
  return (
    <Box sx={{ position: "relative", ml: level / 10 }}>
      {/* Vertical line from parent */}

      {/* Node Container */}
      <Box
        ref={combinedRef}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: "relative",
          p: 1,
          pl: hasChildren ? 1 : 0,
          mb: 0.5,
          borderRadius: 2,
          bgcolor: isDraggedBranch ? "action.hover" : "background.paper",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          transition: "all 0.2s ease",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "action.hover",
            transform: "scale(1.01)",
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          flex={1}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(node.id);
          }}
        >
          {hasChildren ? (
            <IconButton size="small" sx={{ mr: 1 }}>
              {isExpanded ? <TbChevronDown /> : <TbChevronLeft />}
            </IconButton>
          ) : (
            <Box sx={{ width: 32, mr: 1 }} />
          )}
          <Typography
            fontWeight={500}
            color="text.primary"
            sx={{ fontSize: "0.95rem", userSelect: "none" }}
          >
            {node.name}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title={t("common", "add-new")} arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`product-categories/new?parentId=${node.id}`);
              }}
            >
              <TbPlus />
            </IconButton>
          </Tooltip>

          <EditActionItem
            content={node.name}
            href={`product-categories/${node.id}`}
          />
          <DeleteActionItem onClick={handleDelete} rowId={0} />
        </Box>
      </Box>

      {/* Horizontal connector line to children */}
      {hasChildren && isExpanded && (
        <Box
          sx={{
            ml: 2.5,
            pl: 1,
          }}
        >
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onDrop={onDrop}
              onToggleExpand={onToggleExpand}
              expandedIds={expandedIds}
              treeData={treeData}
              setTreeData={setTreeData}
              router={router}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
