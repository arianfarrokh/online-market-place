import { createGridConfig } from "@/utils/data-Grid-Helpers";
import { AllUnitsFilter } from "./graphql";

// Grid config for Units page
export const useGridConfig = () => {
  return createGridConfig<AllUnitsFilter>({
    sort: {
      name: ["name"],
    },
    filter: {
      name: { path: ["name"] },
    },
  });
};
