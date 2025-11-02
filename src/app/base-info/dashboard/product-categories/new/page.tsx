'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BasePage } from '@/components'
import { TbCategory2 } from "react-icons/tb"
import ProductCategoryForm from '../product-category-form'
import {
  CreateProductCategoryMutation,
  allProductCategoriesNoPagedQuery
} from '../graphql'
import type { ProductCategoryType } from '../product-category-form'
import { useAlert } from '@/providers/alert-provider/AlertProvider'
import { useTranslation } from '@/providers/translation'
import { useMutation, useQuery } from '@apollo/client/react'
import { formatString } from '@/utils'

const NewProductCategoryPage = () => {
  const { t } = useTranslation('common', 'form', 'error')
  const router = useRouter()
  const searchParams = useSearchParams()
  const parentId = searchParams.get('parentId')
  const { show } = useAlert()

  const { data: categoriesData } = useQuery<{
    allProductCategoriesNoPage: ProductCategoryType[]
  }>(allProductCategoriesNoPagedQuery, { fetchPolicy: 'no-cache' })

  const [initData, setInitData] = useState<ProductCategoryType>({
    id: 0,
    name: '',
    parent: null,
    parentId: null,
  })

  useEffect(() => {
    if (parentId && categoriesData?.allProductCategoriesNoPage) {
      const parentCategory = categoriesData.allProductCategoriesNoPage.find(
        (cat) => cat.id === parseInt(parentId)
      )
      if (parentCategory) {
        setInitData({
          id: 0,
          name: '',
          parent: parentCategory,
          parentId: parseInt(parentId),
        })
      }
    }
  }, [parentId, categoriesData])

  const [addNewCategory, { loading }] = useMutation(CreateProductCategoryMutation, {
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data.response?.errors?.length) {
        show({
          message: formatString(t('error', 'failed-to-add'),t("form","product-category")),
          type: 'error',
          autoHideDuration: 3000,
        })
      } else {
        show({
          message: t('form', 'success-to-create-category'),
          type: 'success',
          autoHideDuration: 3000,
        })
        router.back()
      }
    },
    onError() {
      show({
        message:  formatString(t('error', 'failed-to-add'),t("form","product-category")),
        type: 'error',
        autoHideDuration: 3000,
      })
    },
  })

  const handleSave = (category: ProductCategoryType) => {
    addNewCategory({
      variables: {
        name: category.name,
        parentId: category.parent?.id ?? category.parentId ?? null,
      },
    })
  }

  return (
    <BasePage
      pageTitle={`${t('common', 'add-new')} ${t("form","product-category")}`}
      maxWidth="md"
      PageIcon={<TbCategory2 fontSize={24} />}
      loading={loading}
    >
      <ProductCategoryForm productCategory={initData} onSave={handleSave} />
    </BasePage>
  )
}

export default NewProductCategoryPage
