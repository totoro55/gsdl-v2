import React, { FC, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Separator,
  Text,
  TextField,
  Tooltip
} from "@radix-ui/themes";
import { Input } from "../ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { toast } from "../ui/use-toast";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";
import { ClipboardCopyIcon, ReloadIcon } from "@radix-ui/react-icons";
import TestDescriptionBlock from "./testDescriptionBlock";
import { getSheetIdFromUrl } from "../../lib/getSheetIdFromUrl";

const AddCredentials: FC = () => {
  const credentials = useLiveQuery(() => db.credentials.toArray(), []) || [];
  const [filePath, setFilePath] = useState<string | null>(null);
  const [url, setUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;
    if (!files[0] || files[0].type !== "application/json") return;
    setFilePath(files[0].path);
  };

  const handleUploadFile = async (): Promise<void> => {
    if (!filePath) return;
    const res = await window.systemApi.uploadCredentials(filePath)
      .then(res => {
        if (typeof res === "string") {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: res
          });
          return;
        } else if (!res) {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Нет ответа от приложения"
          });
          return;
        } else {
          return res;
        }
      }).catch(err => {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: err.message
        });
      });

    if (res && credentials.length < 1) {
      await db.credentials.add({ ...res, is_valid: false })
        .then(() => {
          toast({
            title: "✅",
            description: "Файл Credentials успешно добавлен"
          });
        }).catch(err => {
          toast({
            variant: "destructive",
            title: "Ошибка при добавлении файла",
            description: err.message
          });
        });
      return;
    }

    if (res && credentials.length >= 1) {
      await db.credentials.update(credentials[0].id!, { ...res, is_valid: false })
        .then(() => {
          toast({
            title: "✅",
            description: "Файл Credentials успешно обновлён"
          });
        })
        .catch(err => {
          toast({
            variant: "destructive",
            title: "Ошибка при обновлении файла",
            description: err.message
          });
        });
      return;
    }
  };

  const handleTest = async (): Promise<void> => {
    if (!url || !credentials[0]) return

    const sheetId = getSheetIdFromUrl(url)
    if (!sheetId) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: 'Неправильно указан URL таблицы'
      })
      return
    }
    setIsLoading(true)
    await window.google.getTitles({sheetId:sheetId, credentials:credentials[0]})
      .then(async (res)=>{
        if (res.status !== 200){
          await db.credentials.update(credentials[0].id!, { ...credentials[0], is_valid: false })
          toast({
            variant: "destructive",
            title: "Тест не пройден",
            description: 'Убедитесь, что вы загрузили корректный файл credentials.json и указали ссылку на таблицу, согласно инструкции'
          })
        } else {
          await db.credentials.update(credentials[0].id!, { ...credentials[0], is_valid: true })
          toast({
            title: "Тест пройден",
            description: 'Сервис-аккаунт доступен для использования'
          })
        }
      })
      .catch(async (err)=>{
        await db.credentials.update(credentials[0].id!, { ...credentials[0], is_valid: false })
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: err.message
        })
      })
      .finally(()=>{
        setIsLoading(false)
        setUrl('')
      })
  }

  const handleCopyToClipboard = ():void => {
    if (credentials[0].client_email) {
      navigator.clipboard.writeText(credentials[0].client_email)
      toast({
        description: 'Адрес сервис-аккаунта скопирован в буфер обмена'
      })
    }

  }

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Heading size="3">Добавление сервис-аккаунта Google</Heading>
        <Separator size="4" />
        <Flex direction="row" gap="3" justify="start" >
          {credentials.length>=1 &&
            <Card>
              <Flex direction="column" gap="3" align="center" justify="between">
                <Text size="2">
                  Текущий сервис-аккаунт:
                </Text>
                <Flex gap="3" align="center">
                  <Badge variant="surface">
                    {credentials[0].client_email}
                  </Badge>
                  <Tooltip content="Нажмите чтобы скопировать почту сервис-аккаунта в буфер">
                    <IconButton
                      onClick={handleCopyToClipboard}
                      variant="ghost" mr="1" size="1">
                      <ClipboardCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Flex>
              </Flex>
            </Card>
          }
          <Card>
            <Flex direction="column" gap="3" align="center" justify="between">
              <Text size="2">
                Файл credentials:
              </Text>
              <Badge variant="surface" color={credentials.length ? "green" : "red"}>
                {credentials.length ? "Загружен" : "Не загружен"}
              </Badge>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="3" align="center" justify="between">
              <Text size="2">
                Тест работоспособности сервис-аккаунта:
              </Text>
              <Badge variant="surface" color={credentials[0]?.is_valid ? "green" : "red"}>
                {credentials[0]?.is_valid ? "Успешно протестирован" : "Тест не пройден"}
              </Badge>
            </Flex>
          </Card>
        </Flex>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Добавление нового файла c настройками (credentials.json)</AccordionTrigger>
            <AccordionContent>
              <Flex direction="row" gap="3" align="center">
                <Input
                  onChange={e => handleAddFile(e)}
                  className="w-1/2 cursor-pointer"
                  type="file"
                  id="credentials"
                  accept=".json"
                />
                <Button
                  onClick={handleUploadFile}
                  disabled={!filePath}>
                  Загрузить
                </Button>
              </Flex>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Проверка работоспособности сервис-аккаунта</AccordionTrigger>
            <AccordionContent>
              <Flex direction="column"  gap='3'>
                <TestDescriptionBlock />
                <Flex direction="row" width="100%" gap="3" align="center">
                  <Flex direction="column" width="100%">
                    <TextField.Input
                      value={url}
                      onChange={e=>setUrl(e.target.value)}
                      id='sheet-id'
                      placeholder="Вставьте ID Google таблицы"
                    />
                  </Flex>
                  <Tooltip content={!credentials.length
                    ? 'Сначала загрузите файл credentials.json'
                    : !url ?'Необходимо вставить ID Google таблицы' :'Нажмите, чтобы проверить работоспособность сервис-аккаунта'}>
                    <Button
                      disabled={!credentials.length || isLoading || !url}
                      onClick={handleTest}>
                      {isLoading && <div className='animate-spin text-indigo-500 dark:text-indigo-300 '><ReloadIcon /></div>}
                      Проверить
                    </Button>
                  </Tooltip>
                </Flex>
              </Flex>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Card>
  );
};

export default AddCredentials;
