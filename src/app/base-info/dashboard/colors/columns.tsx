import { useTranslation } from '@/providers/translation'
import { Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

const useCityColumns = (): GridColDef[] => {
  const { t } = useTranslation('form')

  const columns: GridColDef[] = [
    {
      field: 'colorName',
      headerName: t('form', 'color-name'),
      width: 200,
      flex: 3,
    },
    {
      field: 'colorCode',
      headerName: t('form', 'color-code'),
      width: 200,
      flex: 1,
      type: 'custom',
      renderCell: ({ value }) => (
        <Box sx={{ width: 1, height: 1, p: 1, boxSizing: 'border-box' }}>
          <Box sx={{ backgroundColor: value, width: 1, height: 1 }}></Box>
        </Box>
      ),
    },
  ]
  return columns
}

export default useCityColumns
    