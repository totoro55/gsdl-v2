import { FC, useEffect, useState } from "react";
import { TProjectItem } from "../../../../../types/TProjectItem";
import { TProject } from "../../../../../types/TPoject";
import { Box, Button, Flex, Grid, IconButton, Popover, Separator, Tabs, Text, Tooltip } from "@radix-ui/themes";
import { CalendarIcon, CheckIcon, ResetIcon } from "@radix-ui/react-icons";
import { PeriodType } from "../../../../../types/PeriodicType";
import { Toggle } from "../../ui/toggle";
import { db } from "../../../db/db";
import { toast } from "../../ui/use-toast";

const initDates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
const initDays = [
  { value: 1, name: "Пн" },
  { value: 2, name: "Вт" },
  { value: 3, name: "Ср" },
  { value: 4, name: "Чт" },
  { value: 5, name: "Пт" },
  { value: 6, name: "Сб" },
  { value: 0, name: "Вс" }
];

interface Props {
  items: TProjectItem[];
  currentProject: TProject;
  setItems: (items: TProjectItem[]) => void;
}

const MassAutoUploadChange: FC<Props> = ({ items, setItems, currentProject }) => {
  const [type, setType] = useState<PeriodType>(PeriodType.dates);
  const [dates, setDates] = useState<number[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (currentProject.default_period_type) {
      setType(currentProject.default_period_type);
      if (currentProject.default_period_type === PeriodType.dates && currentProject.default_period_dates) {
        setDates(currentProject.default_period_dates);
        return;
      } else if (currentProject.default_period_type === PeriodType.days && currentProject.default_period_days) {
        setDates(currentProject.default_period_days);
        return;
      } else {
        setType(PeriodType.dates);
        setDates([]);
      }
    }
  }, [currentProject.default_period_type, open]);
  const handleTypeChange = (value: string): void => {
    if (value === PeriodType.dates) {
      setDates([]);
      setType(PeriodType.dates);
      return;
    } else {
      setDates([]);
      setType(PeriodType.days);
      return;
    }
  };

  const handleAddDate = (pressed: boolean, value: number): void => {
    if (pressed) {
      setDates([...dates, value]);
      return;
    } else {
      setDates(dates.filter(d => d !== value));
      return;
    }
  };

  const handleRemoveAllDates = (): void => setDates([]);

  const handleAddAllDates = (): void => setDates([...initDates]);

  const handleOffAutoUpload = async ():Promise<void> => {
    if (items.length<1) return
    for (const item of items){
      await db.projectItems.update(item.id!, {['is_periodic']:false, ['period_days']:[], ['period_dates']:[]})
        .catch(err=>toast({variant: 'destructive', title:'Ошибка', description:err.message}))
    }
    toast({title:'Автозагрузка успешно отключена для таблиц:', description:items.map(item=>item.spreadsheet_name.concat('>', item.sheet_title)).join(', ')})
    setOpen(false)
    setItems([])
  }

  const handleUpdateAutoUpload = async ():Promise<void> => {
    if (items.length<1 || dates.length<1) return
    for (const item of items){
      if (type===PeriodType.dates){
        await db.projectItems.update(item.id!, {['is_periodic']:true, ['period_type']:PeriodType.dates, ['period_days']:[], ['period_dates']:dates})
          .catch(err=>toast({variant: 'destructive', title:'Ошибка', description:err.message}))
      } else {
        await db.projectItems.update(item.id!, {['is_periodic']:true, ['period_type']:PeriodType.days, ['period_days']:dates, ['period_dates']:[]})
          .catch(err=>toast({variant: 'destructive', title:'Ошибка', description:err.message}))
      }
    }
    toast({title:'Параметры автозагрузки успешно изменены для таблиц:', description:items.map(item=>item.spreadsheet_name.concat('>', item.sheet_title)).join(', ')})
    setOpen(false)
    setItems([])
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Tooltip content="Изменить период автозагрузки для выделенных элементов">
        <Popover.Trigger>
          <IconButton
            disabled={items.length < 1}
            variant="surface">
            <CalendarIcon />
          </IconButton>
        </Popover.Trigger>
      </Tooltip>
      <Popover.Content style={{ width: 400 }}>
        <Flex direction="column" gap="3">
          <Text as="div" size="2" mb="-1" weight="bold">
            Изменить параметры автозагрузки для всех выбранных элементов
          </Text>
          <Separator size='4' />
          <Button
            onClick={handleOffAutoUpload}
            variant='surface' color='red'>
            Отключить автозагрузку
          </Button>
          <Separator size='4' />
          <Tabs.Root
            value={type}
            onValueChange={value => handleTypeChange(value)}
            defaultValue={PeriodType.dates}>
            <Tabs.List>
              <Tabs.Trigger value={PeriodType.dates}>По дням месяца</Tabs.Trigger>
              <Tabs.Trigger value={PeriodType.days}>По дням недели</Tabs.Trigger>
            </Tabs.List>

            <Box px="4" pt="3">
              <Tabs.Content value={PeriodType.dates}>
                <Grid columns="7" gap="3">
                  {initDates.map((date => {
                    return (
                      <Toggle
                        pressed={dates.includes(date)}
                        onPressedChange={pressed => handleAddDate(pressed, date)}
                        value={date}
                        key={date}
                        aria-label={date.toString()}>
                        {date}
                      </Toggle>
                    );
                  }))}
                  <div></div>
                  <div></div>
                  <Tooltip content="Снять все отметки">
                    <Button
                      onClick={() => handleRemoveAllDates()}
                      color="tomato" variant="surface">
                      <ResetIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Отметить все дни">
                    <Button
                      onClick={() => handleAddAllDates()}
                      color="green" variant="surface">
                      <CheckIcon />
                    </Button>
                  </Tooltip>
                </Grid>
              </Tabs.Content>

              <Tabs.Content value={PeriodType.days}>
                <Grid columns="7" gap="3">
                  {initDays.map((day => {
                    return (
                      <Toggle
                        pressed={dates.includes(day.value)}
                        onPressedChange={pressed => handleAddDate(pressed, day.value)}
                        value={day.value}
                        key={day.value}
                        aria-label={day.name}>
                        {day.name}
                      </Toggle>
                    );
                  }))}
                </Grid>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
          <Separator size='4' />
          <Flex justify="end" gap='3'>
            <Popover.Close>
              <Button
                variant='soft' color='gray'>
                Отмена
              </Button>
            </Popover.Close>
            <Button
              onClick={handleUpdateAutoUpload}
              disabled={dates.length<1}>
              Сохранить изменения
            </Button>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default MassAutoUploadChange;
