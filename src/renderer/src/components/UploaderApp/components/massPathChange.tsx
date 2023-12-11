import { FC, useEffect, useState } from "react";
import { TProjectItem } from "../../../../../types/TProjectItem";
import { TProject } from "../../../../../types/TPoject";
import { Button, Flex, IconButton, Popover, Separator, Text, TextField, Tooltip } from "@radix-ui/themes";
import { FolderIcon } from "lucide-react";
import { IsValidStatus } from "../../../../../types/IsValidStatus";
import { db } from "../../../db/db";
import { toast } from "../../ui/use-toast";

interface Props {
  items: TProjectItem[];
  setItems: (items: TProjectItem[]) => void;
  currentProject: TProject;
}

const MassPathChange: FC<Props> = ({ items, setItems, currentProject }) => {
  const [value, setValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setValue(currentProject.default_path);
  }, [open, currentProject.default_path]);

  const handleChangePath = async (): Promise<void> => {
    if (value.length < 3 || items.length<1) return;
    const path:IsValidStatus = await window.systemApi.checkPathIsValid(value)
      .then(res=> {return res})
      .catch(err=>{return {isValid:false, message:err.message}})

    if (path.isValid){
      for (const item of items){
        await db.projectItems.update(item.id!, {['path']:value})
          .catch(err=>toast({variant: 'destructive', title:'Ошибка', description:err.message}))
      }
      toast({title:'Путь к папке с файлами успешно изменен для таблиц:', description:items.map(item=>item.spreadsheet_name.concat('>', item.sheet_title)).join(', ')})
      setOpen(false)
      setItems([])
    } else {
      toast({variant: 'destructive',title:'Ошибка при проверке пути', description:path.message})
    }
  };



  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Tooltip content="Изменить путь к папке с файлами для выделенных элементов">
        <Popover.Trigger>
          <IconButton
            disabled={items.length < 1}
            variant="surface">
            <FolderIcon width="16" height="16" />
          </IconButton>
        </Popover.Trigger>
      </Tooltip>
      <Popover.Content style={{ width: 400 }}>
        <Flex direction="column" gap="3">
          <Text as="div" size="2" mb="-1" weight="bold">
            Изменить путь к папке с файлами для всех выбранных элементов
          </Text>
          <Separator size="4" />
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Путь к папке с файлами
            </Text>
            <TextField.Input
              id="item-path"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Укажите путь к папке с файлами"
            />
          </label>
          <Separator size="4" />
          <Flex justify="end" gap="3">
            <Popover.Close>
              <Button
                variant="soft" color="gray">
                Отмена
              </Button>
            </Popover.Close>
            <Button
              onClick={handleChangePath}
              disabled={value.length < 3}>
              Сохранить изменения
            </Button>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default MassPathChange;
