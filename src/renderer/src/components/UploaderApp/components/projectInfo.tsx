import { Flex, Heading, IconButton, Popover, Text, Tooltip } from "@radix-ui/themes";
import React from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { TProject } from "../../../../../types/TPoject";
import { PeriodType } from "../../../../../types/PeriodicType";

const days = [
  {value:1, name:'Пн'},
  {value:2, name:'Вт'},
  {value:3, name:'Ср'},
  {value:4, name:'Чт'},
  {value:5, name:'Пт'},
  {value:6, name:'Сб'},
  {value:0, name:'Вс'},
]
interface ProjectInfoProps {
  project:TProject
}
const ProjectInfo:React.FC<ProjectInfoProps> = ({project}) => {
  const period = ():string=>{
    if (!project.default_is_periodic) return ''
    if (project.default_period_type === PeriodType.dates) {
      if (project.default_period_dates!.length===31) {
        return 'Ежедневно'
      } else {
        return project.default_period_dates!.join(', ')
      }
    } else {
      if (project.default_period_days!.length===7) {
        return 'Ежедневно'
      } else {
        return project.default_period_days!.map((d)=>{return days.find(day=>day.value===d)!.name}).join(', ')
      }
    }
  }

  return (
    <Popover.Root>
      <Tooltip content={'Показать информацию о проекте'}>
      <Popover.Trigger>
          <IconButton
            variant='surface'>
            <InfoCircledIcon />
          </IconButton>
      </Popover.Trigger>
    </Tooltip>
      <Popover.Content style={{ width: 360 }}>
        <Flex gap="3" direction='column'>
          <Heading size='2'>{project.name}</Heading>
          <Flex direction='column'>
            <Text as="div" size="1" mb="1" weight="bold">
              Путь по-умолчанию
            </Text>
            <Text as="div" size="2" color='gray'>
              {project.default_path}
            </Text>
          </Flex>
          <Flex direction='column'>
            <Text as="div" size="1" mb="1" weight="bold">
              Автозагрузка по умолчанию
            </Text>
            <Text as="div" size="2" color='gray'>
              {project.default_is_periodic ?"Включена" :"Выключена"}
            </Text>
          </Flex>
          {project.default_is_periodic &&
            <Flex direction='column'>
              <Text as="div" size="1" mb="1" weight="bold">
                Периодичность автозагрузки
              </Text>
              <Text as="div" size="2" color='gray'>
                {project.default_is_periodic && period()}
              </Text>
            </Flex>
          }
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ProjectInfo;
