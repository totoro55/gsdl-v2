import React, { useEffect, useState } from "react";
import { Button, Dialog, Flex, Separator, Strong, Tooltip } from "@radix-ui/themes";
import { FilePlusIcon } from "@radix-ui/react-icons";
import { TProjectItem } from "../../../../../../types/TProjectItem";
import { TProject } from "../../../../../../types/TPoject";
import PathAndFileForm from "./components/pathAndFileForm";
import { toast } from "../../../ui/use-toast";
import AutoUploadForm from "./components/autoUploadForm";
import AddSpreadsheetForm from "./components/addSpreadsheetForm";
import ConfirmForm from "./components/ConfirmForm";
import { db } from "../../../../db/db";

const initProjectItemState: TProjectItem = {
  parent_id: 0,
  created_at: "",
  order: 0,

  path: "",
  files: [],
  spreadsheet_id: "",
  spreadsheet_name: "",
  sheet_title: "",
  pre_cleaning: true,

  is_periodic: false
};

interface Props {
  project: TProject;
}

const ProjectItemForm: React.FC<Props> = ({ project }) => {
  const [item, setItem] = useState<TProjectItem>({ ...initProjectItemState, parent_id: Number(project.id) });
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    setStep(1);
    setItem({
      ...initProjectItemState,
      parent_id: Number(project.id),
      path: project.default_path,
      is_periodic: project.default_is_periodic,
      period_type: project.default_period_type,
      period_days: project.default_period_days,
      period_dates: project.default_period_dates
    });
  }, [open]);


  const handleStepBack = (): void => {
    if (step === 1) {
      setOpen(false);
    } else {
      setStep(step - 1);
    }
  };

  const handleStepTwo = async (): Promise<void> => {
    const isPathValid = await window.systemApi.checkPathIsValid(item.path)
      .then(res => {
        return res;
      }).catch(err => {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: err.message
        });
      });

    if (isPathValid && !isPathValid.isValid) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: isPathValid.message
      });
      return;
    }

    setStep(step + 1);
  };

  const handleAddItem = async ():Promise<void>=>{
    await db.projectItems.add({...item, created_at:new Date().toLocaleString()})
      .then(() => {
        toast({
          title: "Добавлена новая таблица",
          description: `${item.spreadsheet_name} > ${item.sheet_title}`
        });
      })
      .then(()=>setOpen(false))
      .catch(err => {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: `Не удалось добавить элемент: ${err.message}`
        });
      });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Tooltip content={"Добавить новую таблицу для загрузки"}>
          <Button
            onClick={() => setOpen(true)}
            variant="surface">
            <FilePlusIcon />
            Добавить таблицу
          </Button>
        </Tooltip>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>
          Добавление новой таблицы
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          <Strong>{step < 4 ? `Шаг ${step}/3` : "Подтверждение введённых данных"}</Strong>
          <br />
          {step === 1 && "Укажите лист Google таблицы, на который необходимо загружать данные."}
          {step === 2 && "Укажите путь к папке с файлами (по-умолчанию устанавливается путь из проекта) и названия файл(а/ов) с данными для загрузки."}
          {step === 3 && "Укажите, необходимо ли очищать данные с листа перед загрузкой и требуется ли автозагрузка данных (по-умолчанию устанавливается параметры автозагрузки проекта)."}
        </Dialog.Description>
        <Flex direction="column" gap="3">
          <div className={`${step === 1 ? "flex flex-col" : "hidden"} duration-300 transition-all`}>
            <AddSpreadsheetForm item={item} setItem={setItem} />
            {item.spreadsheet_name && <Separator size="4" />}
            <Flex gap="3" mt="3" justify="end">
              <Button
                onClick={handleStepBack}
                variant="soft" color="gray">
                Отмена
              </Button>
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!item.sheet_title}>
                Следующий шаг
              </Button>
            </Flex>
          </div>
          <div className={`${step === 2 ? "flex flex-col " : "hidden"} duration-300 transition-all`}>
            <PathAndFileForm item={item} setItem={setItem} />
            <Separator size="4" />
            <Flex gap="3" mt="3" justify="end">
              <Button
                onClick={handleStepBack}
                variant="soft" color="gray">
                Назад
              </Button>
              <Button
                onClick={handleStepTwo}
                disabled={!item.path || item.files.length < 1}>
                Следующий шаг
              </Button>
            </Flex>
          </div>
          <div className={`${step === 3 ? "flex flex-col " : "hidden"} duration-300 transition-all`}>
            <AutoUploadForm item={item} setItem={setItem} />
            <Separator size="4" />
            <Flex gap="3" mt="3" justify="end">
              <Button
                onClick={handleStepBack}
                variant="soft" color="gray">
                Назад
              </Button>
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!item.path || item.files.length < 1}>
                Следующий шаг
              </Button>
            </Flex>
          </div>
          <div className={`${step === 4 ? "flex flex-col " : "hidden"} duration-300 transition-all`}>
            <ConfirmForm item={item} />
            <Separator size="4" mt='3'/>
            <Flex gap="3" mt="3" justify="end">
              <Button
                onClick={handleStepBack}
                variant="soft" color="gray">
                Назад
              </Button>
              <Button onClick={handleAddItem}>
                Добавить таблицу
              </Button>
            </Flex>
          </div>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProjectItemForm;
