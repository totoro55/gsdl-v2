import { AlertDialog, Button, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import React, { useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { TProject } from "../../../../../types/TPoject";
import { TProjectItem } from "../../../../../types/TProjectItem";
import { db } from "../../../db/db";
import { toast } from "../../ui/use-toast";

interface Props {
  items: TProjectItem[];
  selectedProject: TProject
  setSelectedProject: (project: TProject | undefined) => void;
}

const DeleteProjectForm: React.FC<Props> = ({ items, selectedProject, setSelectedProject }) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleDeleteProject = async (): Promise<void> => {
    if (items.length>=1){
      for (let i=0;i<items.length;){
        await db.projectItems.delete(items[i].id!)
          .catch(err=>{
            toast({
              variant: 'destructive',
              title:'Ошибка',
              description:`Не удалось удалить элемент ${items[i].id!}: ${err.message}`
            })
          }).finally(()=>i++)
      }
    }

    await db.projects.delete(selectedProject.id!)
      .then(()=>{
        toast({
          title:'Проект успешно удалён',
          description:selectedProject.name
        })
      }).then(()=>{
        setOpen(false)
        setSelectedProject(undefined)
      }).catch(err=>{
        toast({
          variant: 'destructive',
          title:'Ошибка',
          description:`Не удалось удалить проект${selectedProject.name}: ${err.message}`
        })
      })

  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <Tooltip content='Удалить текущий проект'>
        <IconButton
          onClick={()=>setOpen(true)}
          color="red" variant="surface">
          <TrashIcon />
        </IconButton>
      </Tooltip>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Удаление проекта</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Вместе с проектом будут удалены все связанные таблицы для загрузки.
          Вы уверены, что хотите удалить проект?
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Отмена
            </Button>
          </AlertDialog.Cancel>
            <Button
              onClick={handleDeleteProject}
              variant="solid" color="red">
              Удалить проект
            </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteProjectForm;
