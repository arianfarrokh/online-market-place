import { createGridConfig } from "@/utils/data-Grid-Helpers";
import { AllCitiesFilter } from "../cities/graphql";

export const useGridConfig = () => {
  return createGridConfig<AllCitiesFilter>({
    sort: {
      name: ["name"],
      province: ["province", "name"],
    },
    filter: {
      name: { path: ["name"] },
      province: { path: ["province", "name"] },
    },
  });
};
