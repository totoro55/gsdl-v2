import React from "react";
import { Flex, Switch, Text } from "@radix-ui/themes";
import PeriodSelect from "./periodSelect";
import { TProject } from "../../../../../../../types/TPoject";
import { PeriodType } from "../../../../../../../types/PeriodicType";


interface Props {
    project:TProject
    setProject:(project:TProject)=>void
}
const AutoUploadSelect: React.FC<Props> = ({project, setProject}) => {

  const handleCheckChange = (checked:boolean):void=> {
      setProject({...project, default_is_periodic:checked, default_period_type:PeriodType.dates, default_period_days:[], default_period_dates:[]})
  }

  return (
    <>
      <Text as="div" size="2" mb="-1" weight="bold">
        Автозагрузка
      </Text>
      <label>
        <Flex gap="2">
          <Switch
            checked={project.default_is_periodic}
            onCheckedChange={checked => handleCheckChange(checked)}
          />
          <Text as="div" size="2">
            {project.default_is_periodic ?'Включена' :'Выключена'}
          </Text>
        </Flex>
      </label>
      {
        project.default_is_periodic &&
        <PeriodSelect
          project={project}
          setProject={setProject}/>
      }
    </>
  );
};

export default AutoUploadSelect;
