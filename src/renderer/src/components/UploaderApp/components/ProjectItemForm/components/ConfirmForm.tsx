import { FC } from "react";
import { TProjectItem } from "../../../../../../../types/TProjectItem";
import { Flex, Text} from "@radix-ui/themes";
import { PeriodType } from "../../../../../../../types/PeriodicType";

const days = [
  {value:1, name:'Пн'},
  {value:2, name:'Вт'},
  {value:3, name:'Ср'},
  {value:4, name:'Чт'},
  {value:5, name:'Пт'},
  {value:6, name:'Сб'},
  {value:0, name:'Вс'},
]
interface Props {
  item:TProjectItem
}
const ConfirmForm:FC<Props> = ({item}) => {

  const period = ():string=>{
    if (!item.is_periodic) return ''
    if (item.period_type === PeriodType.dates) {
      if (item.period_dates!.length===31) {
        return 'Ежедневно'
      } else {
        return item.period_dates!.join(', ')
      }
    } else {
      if (item.period_days!.length===7) {
        return 'Ежедневно'
      } else {
        return item.period_days!.map((d)=>{return days.find(day=>day.value===d)!.name}).join(', ')
      }
    }
  }

  return (
    <Flex direction='column' gap='2'>
      <Flex direction='column' >
        <Text as="div" size="2" weight={'medium'}>
          Наименование Google таблицы
        </Text>
        <Text size='2' color='gray'>
          {item.spreadsheet_name}
        </Text>
      </Flex>
      <Flex direction='column' >
        <Text as="div" size="2" weight={'medium'}>
          Наименование листа
        </Text>
        <Text size='2' color='gray'>
          {item.sheet_title}
        </Text>
      </Flex>
      <Flex direction='column' >
        <Text as="div" size="2" weight={'medium'}>
          Путь к папке с файлами
        </Text>
        <Text size='2' color='gray'>
          {item.path}
        </Text>
      </Flex>
      <Flex direction='column' >
        <Text as="div" size="2" weight={'medium'}>
          Файлы
        </Text>
        <Text size='2' color='gray'>
          {item.files.join(', ')}
        </Text>
      </Flex>
      <Flex direction='column' >
        <Text as="div" size="2" weight={'medium'}>
          Предварительная очистка данных на листе
        </Text>
        <Text size='2' color='gray'>
          {item.pre_cleaning ?"Да":"Нет"}
        </Text>
      </Flex>
      <Flex direction='column' >
        <Text as="div" size="2" weight={'medium'}>
          Автозагрузка
        </Text>
        <Text size='2' color='gray'>
          {item.is_periodic ?"Включена":"Выключена"}
        </Text>
      </Flex>
      {item.is_periodic &&
        <Flex direction='column' >
          <Text as="div" size="2" weight={'medium'}>
            Периодичность автозагрузки
          </Text>
          <Text size='2' color='gray'>
            {period()}
          </Text>
        </Flex>
      }
    </Flex>
  );
};

export default ConfirmForm;
