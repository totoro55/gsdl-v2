import React from "react";
import { Box, Button, Card, Flex, Grid, Tabs, Text, Tooltip } from "@radix-ui/themes";
import { Toggle } from "../../../../ui/toggle";
import { CheckIcon, ResetIcon } from "@radix-ui/react-icons";
import { TProject } from "../../../../../../../types/TPoject";
import { PeriodType } from "../../../../../../../types/PeriodicType";

const dates = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
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
  project:TProject
  setProject:(project:TProject)=>void
}
const PeriodSelect:React.FC<Props> = ({project, setProject}) => {

  const handleTypeChange = (value:string):void=>{
    if (value===PeriodType.dates){
      setProject({...project, default_period_type:PeriodType.dates, default_period_dates:[], default_period_days:[]})
    } else {
      setProject({...project, default_period_type:PeriodType.days, default_period_dates:[], default_period_days:[]})
    }
  }

  const handleAddDate = (pressed:boolean, value:number):void => {
    if (pressed) {
      setProject({...project, default_period_dates:[...project.default_period_dates || [], value].sort((a,b)=>a-b)})
    } else {
      setProject({...project, default_period_dates:[...project.default_period_dates?.filter(d=>d!==value) || []].sort((a,b)=>a-b)})
    }
  }

  const handleAddAllDates = ():void => setProject({...project, default_period_dates:[...dates]})
  const handleRemoveAllDates = ():void => setProject({...project, default_period_dates:[]})


  const handleAddDay = (pressed:boolean, value:number):void => {
    if (pressed) {
      setProject({...project, default_period_days:[...project.default_period_days || [], value].sort((a,b)=>a-b)})
    } else {
      setProject({...project, default_period_days:[...project.default_period_days?.filter(d=>d!==value) || []].sort((a,b)=>a-b)})
    }
  }


  return (
    <Card>
      <Flex direction='column' gap='3'>
        <Text as="div" size="2" mb="-1" weight="bold">
          Периодичность
        </Text>
        <Tabs.Root
          value={project.default_period_type}
          onValueChange={value => handleTypeChange(value)}
          defaultValue={PeriodType.dates}>
          <Tabs.List >
            <Tabs.Trigger value={PeriodType.dates}>По дням месяца</Tabs.Trigger>
            <Tabs.Trigger value={PeriodType.days}>По дням недели</Tabs.Trigger>
          </Tabs.List>

          <Box px="4" pt="3" pb="2">
            <Tabs.Content value={PeriodType.dates}>
              <Grid columns='7' gap='3'>
                {dates.map((date=>{
                  return(
                    <Toggle
                      pressed={project.default_period_dates?.includes(date)}
                      onPressedChange={pressed => handleAddDate(pressed, date)}
                      value={date}
                      key={date}
                      aria-label={date.toString()}>
                      {date}
                    </Toggle>
                  )
                }))}
                <div></div>
                <div></div>
                <Tooltip content='Снять все отметки'>
                  <Button
                    onClick={()=>handleRemoveAllDates()}
                    color='tomato' variant='surface'>
                    <ResetIcon />
                  </Button>
                </Tooltip>
                <Tooltip content='Отметить все дни'>
                  <Button
                    onClick={()=>handleAddAllDates()}
                    color='green' variant='surface'>
                    <CheckIcon />
                  </Button>
                </Tooltip>
              </Grid>
            </Tabs.Content>

            <Tabs.Content value={PeriodType.days}>
              <Grid columns='7' gap='3'>
                {days.map((day=>{
                  return(
                    <Toggle
                      pressed={project.default_period_days?.includes(day.value)}
                      onPressedChange={pressed => handleAddDay(pressed, day.value)}
                      value={day.value}
                      key={day.value}
                      aria-label={day.name}>
                      {day.name}
                    </Toggle>
                  )
                }))}

              </Grid>
            </Tabs.Content>

          </Box>
        </Tabs.Root>
      </Flex>
    </Card>
  );
};

export default PeriodSelect;
