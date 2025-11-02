
export const removeNodeFromTree = (
  nodes: ProductCategoryType[],
  id: number
): ProductCategoryType | null => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) return nodes.splice(i, 1)[0];
    if (nodes[i].children?.length) {
      const found = removeNodeFromTree(nodes[i].children!, id);
      if (found) return found;
    }
  }
  return null;
};

export const addNodeToTree = (
  nodes: ProductCategoryType[],
  targetId: number | null,
  newNode: ProductCategoryType
): boolean => {
  if (targetId === null) {
    nodes.push(newNode);
    return true;
  }
  for (const node of nodes) {
    if (node.id === targetId) {
      node.children = node.children || [];
      node.children.push(newNode);
      return true;
    }
    if (
      node.children?.length &&
      addNodeToTree(node.children, targetId, newNode)
    )
      return true;
  }
  return false;
};

export const getAllDescendantIds = (node: ProductCategoryType): number[] => {
  let ids: number[] = [];
  if (node.children) {
    for (const child of node.children) {
      ids.push(child.id);
      ids = ids.concat(getAllDescendantIds(child));
    }
  }
  return ids;
};

export const findNodeById = (
  nodes: ProductCategoryType[],
  id: number
): ProductCategoryType | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};