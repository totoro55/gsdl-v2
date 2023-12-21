import { IconButton, Popover, ScrollArea, Text } from '@radix-ui/themes'
import React, { FC } from 'react'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { TProjectItem } from '../../../../../types/TProjectItem'
import { TProject } from '../../../../../types/TPoject'
import { TgUser } from '../../../../../types/TgUser'
import { Timer } from '../../../../../types/Timer'
import { LogStoredDataTypes } from '../../../../../types/TLog'
import ProjectItemsTable from './projectItemsTable'

interface Props {
    type:LogStoredDataTypes
    data:TProjectItem[]|TProject[]|TgUser[]|Timer[]
}
const InfoPopover:FC<Props> = ({type, data}) => {

  // {TODO: create other tables for info popover}
  const infoContent = ():React.ReactElement => {
    switch (type) {
      case LogStoredDataTypes.projectItems:
        return (
          // @ts-ignore correct data type
          <ProjectItemsTable data={data} />
        )
      case LogStoredDataTypes.projects:
        return (
          <div>
          </div>
        )
      case LogStoredDataTypes.tgUsers:
        return (
          <div>
          </div>
        )
      case LogStoredDataTypes.timers:
        return (
          <div>
          </div>
        )
      default:
        return (
          <Text size='2'>
            Нет данных для отображения
          </Text>
        )
    }

  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton variant='ghost'>
          <InfoCircledIcon />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content side='left' style={{ maxWidth: 760 }}>
        <ScrollArea scrollbars="vertical" style={{ maxHeight: 480 }}>
          {infoContent()}
        </ScrollArea>
      </Popover.Content>
    </Popover.Root>
  )
}

export default InfoPopover
