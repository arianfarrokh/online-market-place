'use client'
import { BasePage } from '@/components'
import React from 'react'
import { TbCategory2 } from "react-icons/tb";
import TagForm from '../tag-form'
import { tagByIdQuery, updateTagMutation } from '../graphql'
import { ResultById } from '@/graphql/query-types'
import { useTranslation } from '@/providers/translation';
import { useMutation, useQuery } from '@apollo/client/react';
import { useAlert } from '@/providers/alert-provider/AlertProvider';
import { useRouter } from 'next/navigation';
import { formatString } from "@/utils";


type Props = {
  params: Promise<{ id: string }>
}

const initData: TagType = {
  id: 0,
  name: '',
  status: 'ACTIVE'
}

const EditTagPage: React.FC<Props> = ({ params }) => {
  const { id } = React.use(params)
  const { t } = useTranslation('common', 'form', 'error')
  const {show} = useAlert()
  const router = useRouter();
  

  const [tag, setTag] = React.useState<TagType>(initData)

  const { data, loading, error } = useQuery<ResultById<TagType>>(
    tagByIdQuery,
    {
      // context: authContext(),
      fetchPolicy: 'no-cache',
      variables: {
        id: parseInt(id),
      },
    }
  )

  const [update, { data: updateData,  loading: updateLoading, error: updateError }] =
    useMutation(updateTagMutation, {
      // context: authContext(),
      fetchPolicy: 'no-cache',
    })

  const handleSave = (data: TagType) => {
    update({
      variables: {
        input:{
        id: data.id,
        name: data.name,
        status: data.status
        }
      },
    })
  }
    React.useEffect(() => {
      if (!loading && data) {
        setTag(data.result);
      }
    }, [data, loading]);
  
    React.useEffect(() => {
      if (!updateLoading && updateData) {
        show({
          message: formatString( t("common" , "update-successfully")  , t("form", "tag")) ,
          type: "success",
          autoHideDuration: 3000,
        });
        router.back();
      }
      if (!updateLoading && updateError) {
        show({
          message: formatString( t("error" , "failed-to-update")  , t("form", "tag")) ,
          type: "error",
          autoHideDuration: 3000,
        });
      }
    }, [router, show, t, updateData, updateError, updateLoading]);

  React.useEffect(() => {
    if (!loading && data) {
      setTag(data.result)
    }
  }, [data, loading])

  return (
    <BasePage
      pageTitle={` ${t("common", "edit")} ${t("form" , "tag")}  `}
      maxWidth="lg"
      PageIcon={<TbCategory2 fontSize={24} />}
      error={error || updateError || updateData?.response.errors}
    >
      <TagForm tag={tag} onSave={handleSave} />
    </BasePage>
  )
}

export default EditTagPage
