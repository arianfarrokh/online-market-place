import { PROJECT_DESCRIPTION, PROJECT_TITLE } from '@/utils/constant'
import { Metadata } from 'next'
import React, { PropsWithChildren } from 'react'

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {

  return <>{children}</>
}

export default Layout

export const metadata: Metadata = {
  title: `${PROJECT_TITLE} | دسته بندی های کالا `,
  description: PROJECT_DESCRIPTION,
}
