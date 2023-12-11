import { FC } from "react";
import { Flex, Separator, Switch, Text } from "@radix-ui/themes";
import { TProjectItem } from "../../../../../../../types/TProjectItem";
import { PeriodType } from "../../../../../../../types/PeriodicType";
import ItemPeriodSelect from "./itemPeriodSelect";

interface Props {
  item:TProjectItem
  setItem:(item:TProjectItem)=>void
}
const AutoUploadForm:FC<Props> = ({item, setItem}) => {

  const handleCheckChange = (checked:boolean):void=> {
    setItem({...item, is_periodic:checked, period_type:PeriodType.dates, period_days:[], period_dates:[]})
  }

  return (
    <Flex direction='column' gap='3'>
      <Text as="div" size="2" mb="-1" weight="bold">
        Очистка таблицы перед загрузкой данных
      </Text>
      <label className='mb-1'>
        <Flex gap="2">
          <Switch
            checked={item.pre_cleaning}
            onCheckedChange={checked => setItem({...item, pre_cleaning:checked})}
          />
          <Text as="div" size="2">
            {item.is_periodic ?'Включена' :'Выключена'}
          </Text>
        </Flex>
      </label>
      <Separator size='4' />
      <Text as="div" size="2" mb="-1" weight="bold">
        Автозагрузка
      </Text>
      <label className='mb-2'>
        <Flex gap="2">
          <Switch
            checked={item.is_periodic}
            onCheckedChange={checked => handleCheckChange(checked)}
          />
          <Text as="div" size="2">
            {item.is_periodic ?'Включена' :'Выключена'}
          </Text>
        </Flex>
      </label>
      {
        item.is_periodic &&
        <ItemPeriodSelect item={item} setItem={setItem} />
      }
    </Flex>
  );
};

export default AutoUploadForm;
