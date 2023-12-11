import { FC, useEffect, useState } from "react";
import { TProjectItem } from "../../../../../../types/TProjectItem";
import { Badge, Button, Checkbox, Flex, Link, Table, Tooltip } from "@radix-ui/themes";
import { ExternalLinkIcon, UploadIcon } from "@radix-ui/react-icons";
import Menu from "./components/menu";
import { TCredentials } from "../../../../../../types/TCredentials";
import { toast } from "../../../ui/use-toast";
import { db } from "../../../../db/db";
import StatusMessage from "./components/statusMessage";
import { useTheme } from "next-themes";

interface Props {
  item: TProjectItem;
  credentials: TCredentials[];
  selectedItems:TProjectItem[]
  setSelectedItems:(items:TProjectItem[])=>void
  isGroupUpload:boolean
  currUploadItem:TProjectItem|undefined
}

const TableItemRow: FC<Props> = (
  { item,
    credentials,
    selectedItems,
    setSelectedItems ,
    isGroupUpload,
    currUploadItem}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(false)
  const {theme}=useTheme()

  useEffect(() => {
    if (selectedItems.find(sel=>sel.id===item.id)){
      setChecked(true)
      return
    } else {
      setChecked(false)
    }
  }, [selectedItems]);

  useEffect(() => {
    if (currUploadItem && isGroupUpload){
      if (currUploadItem.id===item.id){
        setIsLoading(true)
        return
      }
    }
    setIsLoading(false)
  }, [isGroupUpload, currUploadItem]);

  const handleCheck = (checked:boolean | 'indeterminate'):void => {
    if (checked) {
      setSelectedItems([...selectedItems, item])
      return
    } else {
      setSelectedItems(selectedItems.filter(sel=>sel.id!==item.id))
      return;
    }

  }
  const handleOpenBrowser = (): void => {
    const url = `https://docs.google.com/spreadsheets/d/${item.spreadsheet_id}/edit?usp=sharing`;
    window.systemApi.openExternalLink(url);
  };

  const handleUpload = async (): Promise<void> => {
    if (credentials.length < 1) return;
    setIsLoading(true);
    await window.google.uploadData({ item: item, credentials: credentials[0] })
      .then(res => {
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
      }).catch(err => {
        db.projectItems.update(item.id!, {['status_code']:400, ['status_message']:err.message, ['status_date_time']:new Date().toLocaleString()})
        toast({
          variant: "destructive",
          title: `Ошибка:`,
          description: err.message
        });
      }).finally(() => setIsLoading(false));
  };

  return (
    <Table.Row>
      <Table.RowHeaderCell justify="center">
        <Checkbox checked={checked} onCheckedChange={check => handleCheck(check)}/>
      </Table.RowHeaderCell>
      <Table.Cell justify="center">
        <Tooltip content="Открыть связанную Google таблицу в браузере">
          <Flex asChild align="center" justify="center" gap="1" className="group">
            <Link onClick={handleOpenBrowser}>
              {item.spreadsheet_name}
              <ExternalLinkIcon
                className="opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </Link>
          </Flex>
        </Tooltip>
      </Table.Cell>
      <Table.Cell justify="center">
        {item.sheet_title}
      </Table.Cell>
      <Table.Cell justify="center">
        {item.is_periodic
          ? <Badge>Включена</Badge>
          : <Badge color="gray">Выключена</Badge>
        }
      </Table.Cell>
      <Table.Cell justify="center">
        {item.pre_cleaning
          ? <Badge>Включена</Badge>
          : <Badge color="gray">Выключена</Badge>
        }
      </Table.Cell>
      <Table.Cell justify="center">
        {item.status_date_time
          ? item.status_date_time
          : "-"
        }
      </Table.Cell>
      <Table.Cell justify="center">
        <StatusMessage item={item} />
      </Table.Cell>
      <Table.Cell justify="center">
        <Tooltip content="Загрузить данные на лист">
          {!isLoading &&
            <Button
              disabled={isLoading || isGroupUpload}
              onClick={handleUpload}
              size="1" variant="ghost">
              <UploadIcon /> Загрузить
            </Button>}
        </Tooltip>
        {isLoading &&
          <div className="animate-pulse">
            <Badge variant={theme==='dark' ?'surface' :'solid'} color='amber'>В процессе</Badge>
          </div>}
      </Table.Cell>
      <Table.Cell justify="center">
        <Menu item={item} disabled={isLoading || isGroupUpload}/>
      </Table.Cell>
    </Table.Row>
  );
};

export default TableItemRow;
