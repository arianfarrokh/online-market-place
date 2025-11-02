import { useTranslation } from '@/providers/translation'
import { GridColDef } from '@mui/x-data-grid'

const useCityColumns = (): GridColDef[] => {
  const { t } = useTranslation('form')

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('form', 'product-category-name'),
      width: 200,
      flex: 1,
    },
    {
      field: 'parentName',
      headerName: t('form', 'product-category-parent'),
      width: 200,
      flex: 1,
    },
    {
      field: 'level',
      headerName: t('form', 'level'),
      width: 80,
    },
  ]
  return columns
}

export default useCityColumns
