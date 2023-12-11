import  { FC } from "react";
import { TProjectItem } from "../../../../../../../types/TProjectItem";
import { AlertDialog, Button, Em, Flex, Strong } from "@radix-ui/themes";
import { db } from "../../../../../db/db";
import { toast } from "../../../../ui/use-toast";

interface Props {
  item:TProjectItem
  open:boolean
  setOpen:(value:boolean)=>void
}
const DeleteModal:FC<Props> = ({item, setOpen, open}) => {

  const handleDelete = async ():Promise<void> => {
    await db.projectItems.delete(item.id!)
      .then(()=>{
        toast({
          title:'Элемент успешно удалён',
        })
      })
      .then(()=>setOpen(false))
      .catch(err=>{
        toast({
          variant: 'destructive',
          title:'Ошибка',
          description:`Не удалось удалить элемент: ${err.message}`
        })
      })
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Удаление таблицы</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Вы уверены что хотите удалить данные для загрузки данных в таблицу <Strong>{item.spreadsheet_name}{'>'} {item.sheet_title}</Strong>?
          <br/><br/>
          <Em>Данное действие никак не повлияет на Google таблицу.</Em>
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Отмена
            </Button>
          </AlertDialog.Cancel>
            <Button
              onClick={handleDelete}
              variant="solid" color="red">
              Удалить таблицу
            </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteModal;
