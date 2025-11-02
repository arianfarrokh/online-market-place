import { createGridConfig } from "@/utils/data-Grid-Helpers"
import { AllColorsFilter } from "./graphql"

export const useGridConfig = () => {
    return createGridConfig<AllColorsFilter>({
        sort:{
            colorName: ["colorName"]
        },
        filter:{
            colorName: {path: ["colorName"]}
        }
    })
}