import React from "react";
import { Card, Flex, Separator } from "@radix-ui/themes";
import ProjectSelect from "./projectSelect";
import ProjectForm from "./ProjectForm/projectForm";
import { db } from "../../../db/db";
import { TProject } from "../../../../../types/TPoject";
import { toast } from "../../ui/use-toast";
import DeleteProjectForm from "./deleteProjectForm";
import ProjectInfo from "./projectInfo";
import ProjectItemForm from "./ProjectItemForm/projectItemForm";
import { TProjectItem } from "../../../../../types/TProjectItem";
import MassAutoUploadChange from "./massAutoUploadChange";
import MassPathChange from "./massPathChange";

interface HeaderProps {
  items:TProjectItem[]
  projects: TProject[];
  selectedProject: TProject | undefined;
  setSelectedProject: (project: TProject | undefined) => void;
  selectedItems:TProjectItem[]
  setSelectedItems:(items:TProjectItem[])=>void
}

const Header: React.FC<HeaderProps> = ({items, projects, selectedProject, setSelectedProject, selectedItems, setSelectedItems }) => {

  const handleAddProject = async (project: TProject): Promise<TProject | void> => {
    return db.projects.add({ ...project, created_at: new Date().toLocaleString(), order: projects?.length + 1 || 0 })
      .then((res) => {
        return { ...project, id: res };
      })
      .catch(err => {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: `Не удалось добавить проект ${project.name}: ${err.message}`
        });
      });
  };

  const handleUpdateProject = async (project:TProject):Promise<TProject|void> => {
    return db.projects.update(project.id!, project)
      .then(()=>{
        return project
      }).catch(err => {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: `Не удалось изменить проект ${project.name}: ${err.message}`
        });
      });
  }


  return (
    <Card>
      <Flex direction="row" width="100%" justify={"between"} gap={"3"} align="center">
        <Flex direction="row" gap="3" justify="start">
          <ProjectSelect
            setSelectedProject={setSelectedProject}
            projects={projects}
          />
          {selectedProject &&
            <>
              <ProjectInfo project={selectedProject}/>
              <ProjectForm
                currProject={selectedProject}
                projects={projects}
                projectFunction={handleUpdateProject} />
              <DeleteProjectForm
                items={items}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}/>
            </>

          }
          <Separator orientation="vertical" size="2"/>

        {selectedProject &&
          <>
            <MassAutoUploadChange
              items={selectedItems}
              currentProject={selectedProject}
              setItems={setSelectedItems}
            />
            <MassPathChange
              items={selectedItems}
              setItems={setSelectedItems}
              currentProject={selectedProject}
            />
            <Separator orientation="vertical" size="2" />
          </>
        }
        <ProjectForm
          projects={projects}
          projectFunction={handleAddProject} />
        </Flex>
        {selectedProject && <ProjectItemForm project={selectedProject} />}
      </Flex>
    </Card>
  );
};

export default Header;
