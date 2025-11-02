import { FormActionButtons, FullWidthTextField, PagePanel } from '@/components'
import { useTranslation } from '@/providers/translation'

import { CardContent } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useFormik } from 'formik'
import React from 'react'
import * as yup from 'yup'

type Props = {
  unit: UnitType
  onSave: (unit: UnitType) => void
}

const initialValues: UnitType = {
  id: 0,
  unitName: '',
}

const UnitForm: React.FC<Props> = ({ unit, onSave }) => {
  const { t } = useTranslation('common', 'form', 'error')

  const formik = useFormik<UnitType>({
    initialValues,
    validationSchema: yup.object({
      unitName: yup.string().required(t('error', 'required-field')),
    }),
    onSubmit(values) {
      onSave(values)
    },
  })

  React.useEffect(() => {
    formik.setValues(unit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit])

  return (
    <PagePanel
      title={`${t('common', 'spec')} ${t("form","unit")}`}

    >
      <Grid
        container
        spacing={2}
        component={'form'}
        id="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <Grid size={{ xs: 12 }}>
          <FullWidthTextField formik={formik} id="unit-name" name="unitName" />
        </Grid>
     <CardContent
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <FormActionButtons disabled={!formik.dirty || !formik.isValid} />
      </CardContent>
      </Grid>
    </PagePanel>
  )
}

export default UnitForm
