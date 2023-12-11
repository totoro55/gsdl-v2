import { FC, useState } from "react";
import { TProjectItem } from "../../../../../../../types/TProjectItem";
import {  DropdownMenu, IconButton } from "@radix-ui/themes";
import { DotsHorizontalIcon} from "@radix-ui/react-icons";
import { db } from "../../../../../db/db";
import { toast } from "../../../../ui/use-toast";
import InfoModal from "./infoModal";
import FileModal from "./fileModal";
import AutoUploadModal from "./autoUploadModal";
import DeleteModal from "./deleteModal";

interface Props {
  item: TProjectItem;
  disabled:boolean
}

const Menu: FC<Props> = ({ item , disabled}) => {
  const [infoModal, setInfoModal] = useState<boolean>(false)
  const [filesModal, setFilesModal] = useState<boolean>(false)
  const [autoUploadModal, setAutoUploadModal] = useState<boolean>(false)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)




  const handlePreCleaningChange = async (checked:boolean):Promise<void>=>{

    await db.projectItems.update(item.id!, {['pre_cleaning']:checked})
      .catch(err=>{
        toast({
          variant: 'destructive',
          title:'Ошибка',
          description:`Не удалось внести изменения: ${err.message}`
        })
      })
  }

  return (
    <>
      <DropdownMenu.Root dir='rtl'>
        <DropdownMenu.Trigger disabled={disabled}>
          <IconButton size="2" variant="ghost">
            <DotsHorizontalIcon />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>

          <DropdownMenu.Item
            onClick={()=>setInfoModal(true)}>
            Информация
          </DropdownMenu.Item>
          <DropdownMenu.Item disabled>Лог</DropdownMenu.Item>
          <DropdownMenu.Separator />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              Редактировать
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item
                onClick={()=>setFilesModal(true)}>
                Изменить путь/файлы
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={()=>setAutoUploadModal(true)}>
                Настроить автозагрузку
              </DropdownMenu.Item>

              <DropdownMenu.Separator />
              <DropdownMenu.CheckboxItem
                onCheckedChange={checked => handlePreCleaningChange(checked)}
                checked={item.pre_cleaning}>
                Предочистка
              </DropdownMenu.CheckboxItem>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator />
          <DropdownMenu.Item
            onClick={()=>setDeleteModal(true)}
            color="red">
            Удалить
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <InfoModal item={item} open={infoModal} setOpen={setInfoModal} />
      <FileModal initItem={item} open={filesModal} setOpen={setFilesModal} />
      <AutoUploadModal initItem={item} open={autoUploadModal} setOpen={setAutoUploadModal} />
      <DeleteModal item={item} open={deleteModal} setOpen={setDeleteModal} />
    </>
  );
};

export default Menu;
