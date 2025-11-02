import { useTranslation } from "@/providers/translation";
import { BiMap } from "@/utils/biMap";

export const useActiveStatusMap = () => {
  const { t } = useTranslation("enum");

  return new BiMap<ActiveStatusType, string>([
    ["ACTIVE", t("enum", "ACTIVE")],
    ["INACTIVE", t("enum", "INACTIVE")],
  ]);
};
