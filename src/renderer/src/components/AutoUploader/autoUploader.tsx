import { Card, Dialog, Flex, Separator, Text } from "@radix-ui/themes";
import { db } from "../../db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { FC, useEffect, useRef, useState } from "react";
import { Timer } from "src/types/Timer";
import { TProjectItem } from "src/types/TProjectItem";
import filterItems from "./utils/filterItems";
import { TCredentials } from "src/types/TCredentials";
import { Progress } from "../ui/progress";

const AutoUploader: FC = () => {
  const limit: number = 5;
  const timers = useLiveQuery(() => db.timer.toArray(), []) || [];
  const credentials = useLiveQuery(() => db.credentials.toArray(), []) || [];
  const items = useLiveQuery(() => db.projectItems.toArray(), []) || [];

  const [count, setCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentTry, setCurrentTry] = useState<number>(0);
  const [currentItem, setCurrentItem] = useState<TProjectItem | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  let id = useRef(null);


  const autoUpload = async (date: number, day: number) => {
    const tryLimit = limit;
    let uploadedItems = filterItems(items, date, day);
    if (uploadedItems.length < 1 || credentials.length < 1) return;
    for (let i = 1; i <= tryLimit;) {
      setTotalCount(uploadedItems.length);
      setCurrentTry(i);
      console.log("Попытка №", i);
      uploadedItems = await uploadItems(uploadedItems, credentials[0]).finally()
        .then(res => {
          return res;
        });
      if (uploadedItems.length < 1) {
        console.log("Все данные успешно загружены");
        i = tryLimit;
      } else {
        console.log("Не все данные загружены, переход к следующей попытке");
        i++;
      }
    }

    setCurrentTry(0);
  };

  const uploadItems = async (items: TProjectItem[], credential: TCredentials): Promise<TProjectItem[]> => {
    const errors: TProjectItem[] = [];
    let i = 1;
    for (const item of items) {
      setCount(i);
      setCurrentItem(item);
      await window.google.uploadData({ item: item, credentials: credential })
        .then(async (res) => {
          await db.projectItems.update(item.id!, {
            status_code: res.status,
            status_message: res.message,
            status_date_time: new Date().toLocaleString()
          })
            .then(() => {
              if (res.status !== 200) errors.push(item);
            });
        })
        .catch(async (err) => {
          await db.projectItems.update(item.id!, {
            status_code: 500,
            status_message: err.message,
            status_date_time: new Date().toLocaleString()
          })
            .then(() => {
              errors.push(item);
            });
        })
        .finally(() => {
          i++;
          setCurrentItem(null);
        });
    }
    setCount(0);
    return errors;
  };


  const counter = async (timer: Timer, delay: number) => {
    const currentHours = new Date().getHours();
    const currentMinutes = new Date().getMinutes();


    if (!timer) {
      console.log("not timer", new Date().toLocaleString());
      // @ts-ignore
      id.current = setTimeout(() => {
        counter(timer, delay);
      }, delay);
      return;
    }

    if (!timer.active) {
      console.log("timer off", new Date().toLocaleString());
      // @ts-ignore
      id.current = setTimeout(() => {
        counter(timer, delay);
      }, delay);
      return;
    }
    if (currentHours === timer.hh && currentMinutes === timer.mm) {
      console.log("trigger", new Date().toLocaleString());
      setOpen(true);
      const todayDate = new Date().getDate();
      const todayDay = new Date().getDay();
      setOpen(true);
      await autoUpload(todayDate, todayDay)
        .finally(() => {
          setTotalCount(0);
          setOpen(false);
          // @ts-ignore
          id.current = setTimeout(() => {
            counter(timer, delay);
          }, delay);
        });
      return;
    } else {
      console.log("not trigger", new Date().toLocaleString());
      // @ts-ignore
      id.current = setTimeout(() => {
        counter(timer, delay);
      }, delay);
      return;
    }
  };

  useEffect(() => {
    const timer = timers[0];
    counter(timer, 54000);
    // @ts-ignore
    return () => clearTimeout(id.current);
  }, [timers]);

  return (
    <Dialog.Root open={open}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Автозагрузка</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {`Попытка ${currentTry}/${limit}`}
        </Dialog.Description>

        <Flex direction="column" gap="3">
          {currentItem &&
            <Card>
              <div className="animate-pulse">
                <Flex direction="row" gap="3" align="center">
                  <Text size="3">
                    {currentItem.spreadsheet_name}
                  </Text>
                  <Separator orientation="vertical" size="2" />
                  <Text size="3">
                    {currentItem.sheet_title}
                  </Text>
                </Flex>
              </div>
            </Card>
          }
          {!!totalCount &&
            <>
              <Text size='1'>Прогресс: {count}/{totalCount}</Text>
              <Progress value={count / totalCount * 100} />
            </>
          }
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AutoUploader;
