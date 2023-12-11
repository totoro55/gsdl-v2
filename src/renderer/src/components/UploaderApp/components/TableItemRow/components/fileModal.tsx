import { FC, useEffect, useState } from "react";
import { TProjectItem } from "../../../../../../../types/TProjectItem";
import { Button, Dialog, Flex, Separator } from "@radix-ui/themes";
import PathAndFileForm from "../../ProjectItemForm/components/pathAndFileForm";
import { db } from "../../../../../db/db";
import { toast } from "../../../../ui/use-toast";

interface Props {
  initItem: TProjectItem;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const FileModal: FC<Props> = ({ initItem, setOpen, open }) => {
  const [item, setItem] = useState<TProjectItem>(initItem);

  useEffect(() => {
    setItem(initItem)
  }, [open]);

  const handleUpdateItem = async (): Promise<void> => {
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

    await db.projectItems.update(initItem.id!, { "path": item.path, "files": item.files })
      .then((updated) => {
        if (updated) {
          toast({
            title: "Данные обновлены",
            description: `Путь: ${item.path}; Файлы:${item.files.join(", ")}`
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
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Изменить путь к папке и файлы</Dialog.Title>
        <PathAndFileForm item={item} setItem={setItem} />
        <Separator size='4' />
        <Flex mt="3" gap='3' justify="end">
          <Dialog.Close>
            <Button variant="soft" color='gray'>
              Закрыть
            </Button>
          </Dialog.Close>
          <Button
            onClick={handleUpdateItem}
            disabled={item.files.join(', ').toLowerCase()===initItem.files.join(', ').toLowerCase() &&
            item.path.toLowerCase()===initItem.path.toLowerCase()}>
            Обновить
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default FileModal;
