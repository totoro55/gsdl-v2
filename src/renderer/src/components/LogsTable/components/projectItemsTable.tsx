import { FC } from 'react'
import { TProjectItem } from '../../../../../types/TProjectItem'
import { Badge, Table } from '@radix-ui/themes'

interface Props {
  data:TProjectItem[]
}
const ProjectItemsTable:FC<Props> = ({data}) => {
  return (
    <Table.Root variant="ghost">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Таблица</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Лист</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Период</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Статус</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Описание</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>

        {data.map(item=>{return(
          <Table.Row key={Number(item.id)}>
            <Table.RowHeaderCell>{item.spreadsheet_name}</Table.RowHeaderCell>
            <Table.Cell>{item.sheet_title}</Table.Cell>
            <Table.Cell>{item.status_date_time}</Table.Cell>
            <Table.Cell>
              <Badge color={item.status_code===200 ? 'green' : 'red'}>
                {item.status_code}
              </Badge>
            </Table.Cell>
            <Table.Cell>{item.status_message}</Table.Cell>
          </Table.Row>
        )})}
      </Table.Body>
    </Table.Root>
  )
}

export default ProjectItemsTable
