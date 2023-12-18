import React, { FC } from 'react'
import PageLayout from '../components/PageLayout/pageLayout'
import { Heading } from '@radix-ui/themes'

interface PageProps {
  children?:React.ReactNode
}
const Dashboard: FC<PageProps> = ({ children }: React.PropsWithChildren<PageProps>) => {
  return (
    <PageLayout>
      <Heading>
        Dashboard
      </Heading>
      {children}
    </PageLayout>
  );
};

export default Dashboard
