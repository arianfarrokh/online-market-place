import { createGridConfig } from "@/utils/data-Grid-Helpers";
import { AllTagsFilter } from "./graphql";
import { useActiveStatusMap } from "@/hooks/enums-mappers";

export const useGridConfig = () => {
  const activeStatusMap = useActiveStatusMap();

  return createGridConfig<AllTagsFilter>({
    sort: {
      name: ["name"],
      status: ["status"],
    },
    filter: {
      name: { path: ["name"] },
      status: {
        path: ["status"],
        transform(value) {
          console.log(activeStatusMap.getByValue(value as string));
          return activeStatusMap.getByValue(value as string);
        },
      },
    },
  });
};
