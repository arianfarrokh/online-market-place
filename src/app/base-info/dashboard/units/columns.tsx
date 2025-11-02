
import { useTranslation } from '@/providers/translation'
import { GridColDef } from '@mui/x-data-grid'

const useCityColumns = (): GridColDef[] => {
  const { t } = useTranslation('form')

  const columns: GridColDef[] = [
    {
      field: 'unitName',
      headerName: t('form', 'unit-name'),
      width: 200,
      flex: 1,
    },
  ]
  return columns
}

export default useCityColumns
