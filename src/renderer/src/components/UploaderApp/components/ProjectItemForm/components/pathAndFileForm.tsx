import { FC, useState } from "react";
import { Button, Flex, Select, Separator, Text, TextField } from "@radix-ui/themes";
import { TProjectItem } from "../../../../../../../types/TProjectItem";
import FileItem from "./fileItem";
import { toast } from "../../../../ui/use-toast";

interface Props {
  item: TProjectItem;
  setItem: (item: TProjectItem) => void;
}

const PathAndFileForm: FC<Props> = ({ item, setItem }) => {
  const [value, setValue] = useState<string>("");
  const [extension, setExtension] = useState<string>("");

  const onValueChange = (val: string): void => {
    setValue(val);
    const valArray = val.split(".");
    if (valArray[valArray.length - 1].toLowerCase() === "xlsx") {
      setExtension("xlsx");
    } else if (valArray[valArray.length - 1].toLowerCase() === "xls") {
      setExtension("xls");
    } else {
      setExtension("");
    }
  };

  const onExtensionChange = (ext: string): void => {
    setExtension(ext);
    const valArray = value.split(".");
    if (valArray[valArray.length - 1].toLowerCase().includes("xls") ||
      valArray[valArray.length - 1].toLowerCase().includes("xlsx")) {
      const newValue = value.slice(0, (value.length-valArray[valArray.length - 1].length-1)).concat('.',ext)
      setValue(newValue)
      return
    } else {
      setValue(value.concat('.',ext))
      return;
    }
  };
  const handleAddFile = (): void => {
    if (!value || !extension) return;
    if (item.files.includes(value)) {
      toast({
        variant: 'destructive',
        title:'Ошибка',
        description:'Файл с таким именем уже добавлен.'
      })
      return;
    }
    setItem({...item, files:[...item.files, value]})
    setValue('')
    setExtension('')
  };

  const handleRemoveFile = (file:string):void => {
    setItem({...item, files:item.files.filter(f=>f!==file)})
  }

  return (
    <Flex direction="column" gap="3" mb="3">
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Путь к папке с файлами
        </Text>
        <TextField.Input
          id="item-path"
          value={item.path}
          onChange={e => setItem({ ...item, path: e.target.value })}
          placeholder="Укажите путь к папке с файлами"
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Добавить файл(ы)
        </Text>
        <Flex gap="3" align="center" justify="between">
          <TextField.Root>
            <TextField.Input
              id="item-file-name"
              value={value}
              onChange={e => onValueChange(e.target.value)}
              placeholder="Введите имя файла"
            />
          </TextField.Root>
          <Select.Root
            value={extension}
            onValueChange={value => onExtensionChange(value)}
          >
            <Select.Trigger placeholder="Расширение" />
            <Select.Content>
              <Select.Group>
                <Select.Label>Расширение</Select.Label>
                <Select.Item value="xlsx">.xlsx</Select.Item>
                <Select.Item value="xls">.xls</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
          <Button
            onClick={handleAddFile}
            disabled={!value || !extension}
            variant="solid">
            Добавить
          </Button>
        </Flex>
      </label>
      <Separator size="4" />
      <Flex wrap="wrap" gap="3" justify="start" align="center">
        {item.files.length < 1 && <Text as="div" size="2">Нет файлов</Text>}
        {item.files.length>=1 && item.files.map(file=>{
          return(
            <FileItem key={file} fileName={file} onRemove={handleRemoveFile} />
          )
        })}
      </Flex>
    </Flex>
  );
};

export default PathAndFileForm;
