/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FormActionButtons, FullWidthTextField, PagePanel } from "@/components";
import { useTranslation } from "@/providers/translation";
import Grid from "@mui/material/Grid";
import {
  Box,
  Popper,
  Paper,
  ClickAwayListener,
  Typography,
  IconButton,
  CardContent,
} from "@mui/material";
import { TbChevronDown, TbChevronRight } from "react-icons/tb";
import { useFormik } from "formik";
import React, { useMemo, useRef, useState, useEffect } from "react";
import * as yup from "yup";
import { allProductCategoriesNoPagedQuery } from "./graphql";
import { useQuery } from "@apollo/client/react";
import { getAllDescendantIds, findNodeById } from "./TreeHelpers";

type Props = {
  productCategory: ProductCategoryType;
  onSave: (productCategory: ProductCategoryType) => void;
};

const initialValues: ProductCategoryType = {
  id: 0,
  name: "",
  parent: null,
  parentId: null,
  children: [],
};

const ProductCategoryForm: React.FC<Props> = ({ productCategory, onSave }) => {
  const { t } = useTranslation("common", "form", "error");

  const { data } = useQuery<{
    allProductCategoriesNoPage: ProductCategoryType[];
  }>(allProductCategoriesNoPagedQuery, {
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
  });

  const formik = useFormik<ProductCategoryType>({
    initialValues,
    validationSchema: yup.object({
      name: yup.string().required(t("error", "required-field")),
    }),
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    formik.setValues(productCategory);
  }, [productCategory]);

  const allCategories = data?.allProductCategoriesNoPage ?? [];

  // ----------------
  // Helpers
  // ----------------
  const buildTree = (categories: ProductCategoryType[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = new Map<number, ProductCategoryType & { children: any[] }>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roots: any[] = [];
    categories.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));
    categories.forEach((cat) => {
      const node = map.get(cat.id)!;
      const parentId = cat.parentId ?? null;
      if (parentId && map.has(parentId)) {
        map.get(parentId)!.children.push(node);
      } else roots.push(node);
    });
    return roots;
  };

  const buildCategoryPath = (categoryId: number | null): string => {
    if (!categoryId) return t("common", "main-category");

    const map = new Map<number, ProductCategoryType>();
    allCategories.forEach((cat) => map.set(cat.id, cat));

    const path: string[] = [];
    let currentId: number | null = categoryId;

    while (currentId && map.has(currentId)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const category:any= map.get(currentId)!;
      path.unshift(category.name);
      currentId = category.parentId;
    }

    return path.join("/");
  };

  const treeData = useMemo(() => buildTree(allCategories), [allCategories]);

  // ----------------
  // Prevent invalid parent selection (disable children & descendants)
  // ----------------
  const invalidParentIds = useMemo(() => {
    const treeRootNodes = buildTree(allCategories);
    const currentNode = findNodeById(treeRootNodes, productCategory.id);
    if (!currentNode) return [];
    return [currentNode.id, ...getAllDescendantIds(currentNode)];
  }, [productCategory, allCategories]);

  // ----------------
  // Dropdown logic
  // ----------------
  const [open, setOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelect = (node: ProductCategoryType | null) => {
    if (node && invalidParentIds.includes(node.id)) {
      alert(t("error", "invalid-parent-selection"));
      return;
    }

    formik.setValues({
      ...formik.values,
      parentId: node ? node.id : null,
      parent: node,
    });
    setOpen(false);
  };

  const renderTree = (node: ProductCategoryType, level = 0) => {
    const isExpanded = expandedIds.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isInvalid = invalidParentIds.includes(node.id);

    return (
      <Box key={node.id} sx={{ ml: level * 2, opacity: isInvalid ? 0.5 : 1 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            py: 0.5,
            px: 1,
            borderRadius: 1,
            cursor: isInvalid ? "not-allowed" : "pointer",
            "&:hover": {
              bgcolor: isInvalid ? "inherit" : "action.hover",
            },
          }}
          onClick={() => {
            if (!isInvalid) handleSelect(node);
          }}
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            {hasChildren ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
              >
                {isExpanded ? <TbChevronDown /> : <TbChevronRight />}
              </IconButton>
            ) : (
              <Box sx={{ width: 24 }} />
            )}
            <Typography
              sx={{
                fontWeight: formik.values.parentId === node.id ? "bold" : "normal",
                color: isInvalid
                  ? "text.disabled"
                  : formik.values.parentId === node.id
                  ? "primary.main"
                  : "inherit",
              }}
            >
              {node.name}
            </Typography>
          </Box>
        </Box>

        {hasChildren && isExpanded && (
          <Box mt={0.3}>
            {node.children!.map((child) => renderTree(child, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <PagePanel title={`${t("common", "spec")} ${t("form","product-category")}`}>
      <Grid
        container
        spacing={2}
        component="form"
        id="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <Grid size={{ xs: 12 }}>
          <FullWidthTextField
            formik={formik}
            id="product-category-name"
            name="name"
            label={t("common", "category-name")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box ref={anchorRef} position="relative">
            <FullWidthTextField
              id="product-category-parent"
              name="parent"
              formik={formik}
              value={buildCategoryPath(formik.values.parentId)}
              onClick={() => setOpen((prev) => !prev)}
              placeholder={t("common", "main-category")}
              InputProps={{ readOnly: true }}
            />

            <Popper
              open={open}
              anchorEl={anchorRef.current}
              placement="bottom-start"
              style={{
                zIndex: 1300,
                width: anchorRef.current?.offsetWidth,
              }}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Paper sx={{ maxHeight: 300, overflow: "auto", mt: 0.5, p: 1 }}>
                  <Box
                    sx={{
                      py: 0.5,
                      px: 1,
                      borderRadius: 1,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                      fontWeight: formik.values.parentId === null ? "bold" : "normal",
                      color: formik.values.parentId === null ? "primary.main" : "inherit",
                    }}
                    onClick={() => handleSelect(null)}
                  >
                    {t("common", "main-category")}
                  </Box>

                  {treeData.length > 0 ? (
                    treeData.map((node) => renderTree(node))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t("common", "no-categories")}
                    </Typography>
                  )}
                </Paper>
              </ClickAwayListener>
            </Popper>
          </Box>
        </Grid>
      </Grid>

      <CardContent
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <FormActionButtons disabled={!formik.dirty || !formik.isValid} />
      </CardContent>
    </PagePanel>
  );
};

export default ProductCategoryForm;
