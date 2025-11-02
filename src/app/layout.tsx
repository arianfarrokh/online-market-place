import RootLayout from '@/components/layouts/root-layout/RootLayout'
import { PROJECT_DESCRIPTION, PROJECT_TITLE } from '@/utils/constant'
import { Metadata } from 'next'
import React, { ReactNode } from 'react'

type Props = {
  children : ReactNode
}

function Layout({children}: Props) {
  return (
    <RootLayout>{children}</RootLayout>
  )
}

export default Layout

export const metadata: Metadata ={
  title:`${PROJECT_TITLE}`,
  description:`${PROJECT_DESCRIPTION}`
}