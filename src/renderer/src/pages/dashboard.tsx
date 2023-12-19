import React, { FC } from 'react'
import PageLayout from '../components/PageLayout/pageLayout'
import { Grid} from '@radix-ui/themes'
import LogsTable from '../components/LogsTable/logsTable'

interface PageProps {
  children?:React.ReactNode
}
const Dashboard: FC<PageProps> = () => {
  return (
    <PageLayout>
        <Grid columns='3' width='auto'>
          <div className='col-start-2 col-end-4'>
            <LogsTable />
          </div>
        </Grid>
    </PageLayout>
  );
};

export default Dashboard
