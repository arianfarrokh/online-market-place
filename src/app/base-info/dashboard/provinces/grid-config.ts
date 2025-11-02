import { createGridConfig } from "@/utils/data-Grid-Helpers";
import { AllProvincesFilter } from "./graphql";

// اگر خواستی بعداً transform هم اضافه کنی (مثلاً برای enum یا تبدیل مقادیر)
export const useGridConfig = () => {
  return createGridConfig<AllProvincesFilter>({
    sort: {
      name: ["name"],
      code: ["code"],
    },
    filter: {
      name: { path: ["name"] },
      code: { path: ["code"] },
    },
  });
};
