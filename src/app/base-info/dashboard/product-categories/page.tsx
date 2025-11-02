"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import {
  allProductCategoriesNoPagedQuery,
  updateProductCategoryMutation,
} from "./graphql";
import { BasePage, PagePanel, AddNewButton } from "@/components";
import { TbCategory2 } from "react-icons/tb";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import { RootDropZone } from "./RootDropZone";
import { TreeNode } from "./TreeNode";
import { useAlert } from "@/providers/alert-provider/AlertProvider";
import {
  removeNodeFromTree,
  addNodeToTree,
  getAllDescendantIds,
  findNodeById,
} from "./TreeHelpers";
import { useTranslation } from "@/providers/translation";
import { useMutation, useQuery } from "@apollo/client/react";
import { formatString } from "@/utils";


// ---------------- Component ----------------
export default function ProductCategoriesPage() {
  const router = useRouter();
  const { t } = useTranslation("common", "error", "form");
  const { show } = useAlert();

  const { data, loading, error } = useQuery<{
    allProductCategoriesNoPage: ProductCategoryType[];
  }>(allProductCategoriesNoPagedQuery, { fetchPolicy: "no-cache" });

  const [updateCategory] = useMutation(updateProductCategoryMutation);

  const [treeData, setTreeData] = useState<ProductCategoryType[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // ---------------- Page Loading ----------------
  const pageLoading = useRef<boolean>(true);
  if (loading) pageLoading.current = true;
  else if (!loading && pageLoading.current) pageLoading.current = false;

  // ---------------- Build tree ----------------
  useEffect(() => {
    if (!data?.allProductCategoriesNoPage) return;

    const map = new Map<number, ProductCategoryType>();
    const roots: ProductCategoryType[] = [];

    data.allProductCategoriesNoPage.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    data.allProductCategoriesNoPage.forEach((cat) => {
      const node = map.get(cat.id)!;
      const parentId = cat.parentId ?? null;
      if (parentId && map.has(parentId)) {
        map.get(parentId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    setTreeData(roots);
  }, [data]);

  const toggleExpand = (id: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // ---------------- Drag & Drop ----------------
  const handleDrop = async (dragId: number, dropId: number | null) => {
    if (dragId === dropId) return;

    const draggedNode = findNodeById(treeData, dragId);
    if (!draggedNode) return;

    const descendantIds = getAllDescendantIds(draggedNode);
    if (dropId && descendantIds.includes(dropId)) {
      show({
        message: t("error", "cannot-move-inside-own-children"),
        type: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    const newTree = JSON.parse(JSON.stringify(treeData));
    const removedNode = removeNodeFromTree(newTree, dragId);
    if (!removedNode) return;

    addNodeToTree(newTree, dropId, removedNode);
    setTreeData(newTree);

    try {
      await updateCategory({
        variables: {
          id: removedNode.id,
          name: removedNode.name,
          sortOrder: 1,
          parentId: dropId ?? null,
        },
      });
    } catch {
      show({
        message: formatString(t("error", "failed-to-update"),t("form","product-category")),
        type: "error",
        autoHideDuration: 2000,
      });
    }
  };

  return (
    <BasePage
      loading={pageLoading.current}
      pageTitle={t("form", "product-categories")}
      PageIcon={<TbCategory2 fontSize={24} />}
      ActionButton={<AddNewButton href="product-categories/new" />}
      error={error}
      maxWidth="md"
    >
      <PagePanel title={`${t("common", "list")} ${t("form","product-categories")}`}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : treeData.length === 0 ? (
          <Typography sx={{ mt: 2 }}>
            {t("common", "no-categories-found")}
          </Typography>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <RootDropZone onDrop={handleDrop} />
            <Box
              sx={{
                bgcolor: "background.paper",
                border: `2px solid var(--color-yellow)`,
                borderRadius: 2,
                p: 1,
              }}
            >
              {treeData.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  level={0}
                  onDrop={handleDrop}
                  onToggleExpand={toggleExpand}
                  expandedIds={expandedIds}
                  treeData={treeData}
                  setTreeData={setTreeData}
                  router={router}
                />
              ))}
            </Box>
          </DndProvider>
        )}
      </PagePanel>
    </BasePage>
  );
}
