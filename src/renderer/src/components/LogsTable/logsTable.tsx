import { FC, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { Badge, Card, Flex, Heading, IconButton, ScrollArea, Table, Tooltip } from '@radix-ui/themes'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'

const LogsTable: FC = () => {
  const logs = useLiveQuery(() => db.logs.toArray(), []) || []
  const [showErrorsOnly, setShowErrorsOnly] = useState<boolean>(false)


  const memoizedLogs = useMemo(() => {
    if (showErrorsOnly) {
      return logs.filter(l => l.isError)
        .sort((a, b) => {
          return a.created_at > b.created_at ? -1 : a.created_at < b.created_at ? 1 : 0;
        })
    }
    return logs.sort((a, b) => {
      return a.created_at > b.created_at ? -1 : a.created_at < b.created_at ? 1 : 0;
    })
  }, [logs, showErrorsOnly])

  return (
    <Card>
      <ScrollArea style={{ height: 700 }}>
        <Heading mb="6" mt="3">Логи</Heading>
        <Table.Root variant="ghost">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Дата</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Тип</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <Flex align="center" justify="between" gap="3">
                  Статус
                  <Tooltip content={showErrorsOnly ? 'Показать все' : 'Показать только ошибки'}>
                    <IconButton
                      onClick={() => setShowErrorsOnly(!showErrorsOnly)}
                      variant="ghost">
                      {showErrorsOnly ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </IconButton>
                  </Tooltip>
                </Flex>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Описание</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {memoizedLogs.length >= 1 && memoizedLogs.map(log => (
              <Table.Row key={log.id}><Table.RowHeaderCell>
                {log.created_at.toLocaleString()}</Table.RowHeaderCell>
                <Table.Cell>{log.type}</Table.Cell>
                <Table.Cell>
                  <Badge color={log.isError ? 'red' : 'green'}>
                    {log.isError ? 'Ошибка' : 'Успешно'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {log.description}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </ScrollArea>
    </Card>
  )
}

export default LogsTable
