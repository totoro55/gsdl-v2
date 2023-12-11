import React, { useEffect, useState } from "react";
import { Flex, ScrollArea, Text } from "@radix-ui/themes";
import Header from "./components/header";
import { db } from "../../db/db";
import Footer from "./components/footer";
import ItemsTable from "./components/itemsTable";
import { useLiveQuery } from "dexie-react-hooks";
import { TProject } from "../../../../types/TPoject";
import { TProjectItem } from "../../../../types/TProjectItem";
import { toast } from "../ui/use-toast";

const UploaderApp: React.FC = () => {
  const credentials = useLiveQuery(()=>db.credentials.toArray(),[])||[]
  const projects = useLiveQuery(() => db.projects.toArray(), []) || [];
  const [selectedProject, setSelectedProject] = useState<TProject|undefined>(undefined)
  const [selectedItems, setSelectedItems] = useState<TProjectItem[]>([])
  const items = useLiveQuery(()=>db.projectItems.where('parent_id').equals(selectedProject ?selectedProject.id! :0).toArray(), [selectedProject])||[]
  const [isGroupUpload, setIsGroupUpload] = useState<boolean>(false)
  const [currUploadItem, setCurrUploadItem] = useState<TProjectItem|undefined>(undefined)


  useEffect(() => {
    setSelectedItems([])
  }, [selectedProject]);

  const handleUploadItems = async (items:TProjectItem[]):Promise<void>=>{
    if (credentials.length<1) return
    if (items.length<1) return
    setIsGroupUpload(true)
    for (const item of items) {
      setCurrUploadItem(item)
      await window.google.uploadData({item:item, credentials:credentials[0]})
        .then((res)=>{
          if (res.status===200) {
            db.projectItems.update(item.id!, {['status_code']:res.status, ['status_message']:res.message, ['status_date_time']:new Date().toLocaleString()})
            toast({
              title: `${item.spreadsheet_name} > ${item.sheet_title}`,
              description: `${res.status}: ${res.message}`
            });
          } else {
            db.projectItems.update(item.id!, {['status_code']:res.status, ['status_message']:res.message, ['status_date_time']:new Date().toLocaleString()})
            toast({
              variant: 'destructive',
              title: `${item.spreadsheet_name} > ${item.sheet_title}`,
              description: `Ошибка при загрузке:${res.status} ${res.message}`
            });
          }
        })
        .catch(err=>{
          db.projectItems.update(item.id!, {['status_code']:400, ['status_message']:err.message, ['status_date_time']:new Date().toLocaleString()})
          toast({
            variant: "destructive",
            title: `Ошибка:`,
            description: err.message
          });
        })
        .finally(()=>setCurrUploadItem(undefined))
    }
    setIsGroupUpload(false)
    setSelectedItems([])
  }

  return (
    <Flex direction={"column"} gap='3'>
      <Header
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        items={items}
        setSelectedProject={setSelectedProject}
        selectedProject={selectedProject}
        projects={projects} />
      <ScrollArea type='auto' style={{maxHeight:680, minHeight:'fit-content'}}>
          <Flex width="100%" direction="column" gap="3" pr='5'>
            {items.length>=1 &&
              <ItemsTable
                currUploadItem={currUploadItem}
                isGroupUpload={isGroupUpload}
                credentials={credentials}
                items={items} selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}/>
            }
            {!items.length && selectedProject && <Text my='9' align='center'>Не найдено ни одного элемента. Добавьте таблицу для заггрузки</Text>}
            {!selectedProject && <Text my='9' align='center'>Выберите или создайте новый проект</Text>}
        </Flex>
      </ScrollArea>
      {items.length>=1 &&
        <Footer
          items={items}
          selectedItems={selectedItems}
          isGroupUpload={isGroupUpload}
          onGroupUpload={handleUploadItems}/>
      }
    </Flex>


  );
};

export default UploaderApp;
