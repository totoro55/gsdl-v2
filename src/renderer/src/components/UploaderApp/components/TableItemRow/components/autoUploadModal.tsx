import { FC, useEffect, useState } from "react";
import { TProjectItem } from "../../../../../../../types/TProjectItem";
import { Button, Dialog, Flex, Separator, Switch, Text } from "@radix-ui/themes";
import ItemPeriodSelect from "../../ProjectItemForm/components/itemPeriodSelect";
import { PeriodType } from "../../../../../../../types/PeriodicType";
import { db } from "../../../../../db/db";
import { toast } from "../../../../ui/use-toast";

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
  initItem:TProjectItem
  open:boolean
  setOpen:(value:boolean)=>void
}
const AutoUploadModal:FC<Props> = ({initItem, setOpen, open}) => {
  const [item, setItem] = useState<TProjectItem>(initItem)

  useEffect(() => {
    setItem(initItem)
  }, [open]);

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

  const handleCheckChange = (checked:boolean):void=> {
    setItem({...item, is_periodic:checked, period_type:PeriodType.dates, period_days:[], period_dates:[]})
  }

  const handleUpdate = async ():Promise<void> => {
    if (!item.is_periodic) {
      await db.projectItems.update(initItem.id!,
        {'is_periodic':false, 'period_type':undefined, 'period_days':[], 'period_dates':[]})
        .then((updated) => {
          if (updated) {
            toast({
              title: "Данные обновлены",
              description: `Автозагрузка выключена`
            });
            setOpen(false)
          } else {
            toast({
              variant: 'destructive',
              title: "Ошибка",
              description: `Не удалось обновить элемент: ${item.id!}`
            })}
        })
        .catch(err=>{
          toast({
            variant: 'destructive',
            title: "Ошибка",
            description: err.message
          });
        });
      setOpen(false)
      return
    }

    if (item.period_type === PeriodType.dates && item.period_dates!.length<1) {
      toast({
        variant: 'destructive',
        title: "Ошибка",
        description: 'Необходимо выбрать хотя бы 1 день месяца'
      });
      return
    } else if (item.period_type === PeriodType.days && item.period_days!.length<1) {
      toast({
        variant: 'destructive',
        title: "Ошибка",
        description: 'Необходимо выбрать хотя бы 1 день недели'
      });
      return
    } else {
      await db.projectItems.update(initItem.id!,
        {'is_periodic':true, 'period_type':item.period_type, 'period_days':item.period_days, 'period_dates':item.period_dates})
        .then((updated) => {
          if (updated) {
            toast({
              title: "Данные обновлены",
              description: `Автозагрузка: Вкл;
              ${item.period_type === PeriodType.dates ?'По дням месяца' :'По дням недели'}
              Периодичность:${period()}`
            });
            setOpen(false)
          } else {
            toast({
              variant: 'destructive',
              title: "Ошибка",
              description: `Не удалось обновить элемент: ${item.id!}`
            })}
        })
        .catch(err=>{
          toast({
            variant: 'destructive',
            title: "Ошибка",
            description: err.message
          });
        });
      setOpen(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Изменить путь к папке и файлы</Dialog.Title>
        <Flex direction='column' gap='3'>
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
        <Separator size='4' />
        <Flex mt="3" gap='3' justify="end">
          <Dialog.Close>
            <Button variant="soft" color='gray'>
              Закрыть
            </Button>
          </Dialog.Close>
          <Button
            onClick={handleUpdate}
            >
            Обновить
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AutoUploadModal;
