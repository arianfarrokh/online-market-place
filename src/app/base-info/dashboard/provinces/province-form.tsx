import { FormActionButtons, FullWidthTextField, PagePanel } from '@/components'
import { useTranslation } from '@/providers/translation'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import { useFormik } from 'formik'
import React from 'react'
import * as yup from 'yup'

type Props = {
  province: ProvinceType
  onSave: (province: ProvinceType) => void
}

const ProvinceForm: React.FC<Props> = ({ province, onSave }) => {
  const { t } = useTranslation('common', 'form', 'error')

  const formik = useFormik<ProvinceType>({
    initialValues: {
      id: 0,
      prefixNumber: '',
      name: '',
        },
    validationSchema: yup.object({
      name: yup.string().required(t('error', 'required-field')),
      prefixNumber: yup.string().required(t('error', 'required-field')),
      // code: yup.string().required(t('error', 'required-field')),
    }),
    onSubmit(values) {
      onSave(values)
    },
  })

  React.useEffect(() => {
    if (province) {
      formik.setValues(province)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province])

  return (
    <PagePanel title={`${t('common', 'spec')} ${t("form","province")}`}>
      <Grid
        container
        spacing={2}
        component="form"
        id="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <Grid size={{ xs: 12, sm: 6 }}
>
          <FullWidthTextField formik={formik} id="name" name="name" required />
        </Grid>


        <Grid size={{ xs: 12, sm: 6 }}
>
          <FullWidthTextField
            formik={formik}
            id="prefix-number"
            name="prefixNumber"
            required
          />
        </Grid>
      </Grid>

      <CardContent
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
        }}
      >
        <FormActionButtons disabled={!formik.dirty || !formik.isValid} />
      </CardContent>
    </PagePanel>
  )
}

export default ProvinceForm
