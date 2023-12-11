import { Button, Flex, Separator, Text, TextField } from "@radix-ui/themes";
import { FC, useState } from "react";
import { TProjectItem } from "../../../../../../../types/TProjectItem";
import TitleSelect from "./titleSelect";
import ReloadSpinner from "../../../../ui/reloadSpinner";
import { getSheetIdFromUrl } from "../../../../../lib/getSheetIdFromUrl";
import { toast } from "../../../../ui/use-toast";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../../../db/db";

interface Props {
  item: TProjectItem;
  setItem: (item: TProjectItem) => void;
}

const AddSpreadsheetForm: FC<Props> = ({ item, setItem }) => {
  const credentials = useLiveQuery(() => db.credentials.toArray(), []);
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [titles, setTitles] = useState<string[]>([]);

  const handleGetSpreadsheetInfo = async ():Promise<void> => {
    if (!url) return;
    const id = getSheetIdFromUrl(url);
    if (!id) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Указан некорректный URL Таблицы"
      });
      return;
    }
    if (!credentials) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Нет данных сервис-аккаунта"
      });
      return;
    }
    setIsLoading(true)
    await window.google.getSpreadsheetInfo({ sheetId: id, credentials: credentials[0] })
      .then(res=>{
        if (res.status!==200 && typeof res.data === 'string'){
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: res.data
          });
        } else if (typeof res.data !== 'string') {
          setItem({...item, spreadsheet_name:res.data.spreadsheetTitle, spreadsheet_id:id, sheet_title:''})
          setTitles(res.data.titles)
        }
      })
      .catch(err=>{
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: err.message
        });
      })
      .finally(()=>setIsLoading(false))
  };


  return (
    <Flex direction="column" gap="3" mb='3'>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          URL Google таблицы
        </Text>
          <TextField.Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            id="url"
            placeholder="Вставьте URL Google таблицы"
          />
      </label>
      <Button
        onClick={handleGetSpreadsheetInfo}
        disabled={!url || isLoading}>
        <Flex align="center" gap="3">
          {isLoading && <ReloadSpinner />}
          Получить данные документа
        </Flex>
      </Button>
      <Separator size="4" />
      <Text as="div" size="2" align='center' weight={'medium'}>
        {item.spreadsheet_name && `Google Таблица: ${item.spreadsheet_name}`}
      </Text>
      {titles.length >= 1 && <TitleSelect titles={titles} item={item} setItem={setItem} />}
    </Flex>
  );
};

export default AddSpreadsheetForm;
