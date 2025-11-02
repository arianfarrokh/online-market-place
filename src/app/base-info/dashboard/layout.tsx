import  DashboardLayout  from '@/components/layouts/dashboard-layout/dashboardLayout'
import { PROJECT_DESCRIPTION, PROJECT_TITLE } from '@/utils/constant'
import { Metadata } from 'next'
import React, { PropsWithChildren } from 'react'

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {

  return <DashboardLayout>{children}</DashboardLayout>
}

export default Layout

export const metadata: Metadata ={
  title:`${PROJECT_TITLE} | داشبورد `,
  description:`${PROJECT_DESCRIPTION}`
}
