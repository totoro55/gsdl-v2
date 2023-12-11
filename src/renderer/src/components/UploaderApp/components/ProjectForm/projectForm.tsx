import { Button, Dialog, Flex, IconButton, Text, TextField, Tooltip } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { Pencil2Icon, PlusIcon } from "@radix-ui/react-icons";
import AutoUploadSelect from "./components/autoUploadSelect";
import { TProject } from "../../../../../../types/TPoject";
import { toast } from "../../../ui/use-toast";
import { PeriodType } from "../../../../../../types/PeriodicType";

const initProjectState: TProject = {
  name: "",
  created_at: "",
  order: 0,
  default_path: "",
  default_is_periodic: false,
  is_hidden: false
};

interface ProjectFormProps {
  currProject?: TProject
  projectFunction:(project:TProject)=>Promise<TProject|void>
  projects:TProject[]
}

const ProjectForm: React.FC<ProjectFormProps> = ({ currProject, projectFunction , projects}) => {
  const [project, setProject] = useState<TProject>(initProjectState);
  const [open, setOpen] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    if (currProject) {
      setProject(currProject);
    }
  }, [currProject, open]);

  useEffect(() => {
    if (project.name.length < 3) return setIsFormValid(false);
    const filteredProjects = projects.filter(p=>p.id !== project.id)
    if (filteredProjects.find(p=>p.name.toLowerCase()===project.name.toLowerCase())){
      toast({
        variant: "destructive",
        title:'Ошибка',
        description:'Проект с таким именем уже существует'
      })
      return setIsFormValid(false);
    }
    if (project.default_path.length < 3) return setIsFormValid(false);
    if (project.default_is_periodic &&
      project.default_period_type === PeriodType.dates &&
      !project.default_period_dates?.length
    ) {
      return setIsFormValid(false);
    }
    if (project.default_is_periodic &&
      project.default_period_type === PeriodType.days &&
      !project.default_period_days?.length
    ) {
      return setIsFormValid(false);
    }



    setIsFormValid(true);
  }, [project, projects]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value.length > 30) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Название не может быть более 30 символов"
      });
      return;
    }
    setProject({ ...project, name: e.target.value });
  };

  const handleCloseDialog = (): void => {
    if (currProject) {
      setProject(currProject)
      setOpen(false);
    } else {
      setProject(initProjectState);
      setOpen(false);
    }
  };

  const handleSubmit = async ():Promise<void>=> {
    const isPathValid = await window.systemApi.checkPathIsValid(project.default_path)
      .then(res=>{
      return res
    }).catch(err=>{
      toast({
        variant: 'destructive',
        title:'Ошибка',
        description:err.message
      })
    })

    if (isPathValid && !isPathValid.isValid) {
      toast({
        variant: 'destructive',
        title:'Ошибка',
        description:isPathValid.message
      })
      return
    }

    const successMessage:string = currProject ? 'Проект успешно обновлен' : 'Проект успешно добавлен'

    await projectFunction(project)
      .then(res=>{
        if (res) {
          toast({
            title:successMessage,
            description:project.name
          })}
      })
      .then(()=>{
        setOpen(false)
        setProject(initProjectState)
      })
      .catch(err=>{
        toast({
          variant: 'destructive',
          title:'Ошибка',
          description:err.message
        })
      })
  }


  return (
    <Dialog.Root open={open} onOpenChange={handleCloseDialog}>
      <Dialog.Trigger>
        {currProject
          ?
            <Tooltip content={"Отредаткировать текущий проект"}>
            <IconButton
              onClick={() => setOpen(true)}
              variant="surface">
              <Pencil2Icon />
            </IconButton>
          </Tooltip>
          :
          <Tooltip content={"Добавить новый проект"}>
            <IconButton
              onClick={() => setOpen(true)}
              variant="surface">
              <PlusIcon />
            </IconButton>
          </Tooltip>
        }
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>
          {currProject
            ? "Редактирование проекта"
            : "Добавление нового проекта"
          }
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {currProject
            ? "Внесите изменения в проект"
            : "Укажите параметры нового проекта"
          }
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Название проекта
            </Text>
            <TextField.Input
              id="project-name"
              value={project.name}
              onChange={e => handleNameChange(e)}
              placeholder="Введите название проекта"
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Путь по умолчанию
            </Text>
            <TextField.Input
              id="project-path"
              value={project.default_path}
              onChange={e => setProject({ ...project, default_path: e.target.value })}
              placeholder="Укажите путь по умолчанию к папке с файлами"
            />
          </label>
          <AutoUploadSelect
            project={project}
            setProject={setProject} />
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Button
            onClick={handleCloseDialog}
            variant="soft" color="gray">
            Отмена
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}>
            {currProject ?'Сохранить' :'Добавить'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProjectForm;
