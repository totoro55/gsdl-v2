import { Card, Dialog, Flex, Separator, Text } from '@radix-ui/themes'
import { db } from '../../db/db'
import { useLiveQuery } from 'dexie-react-hooks'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Timer } from 'src/types/Timer'
import { TProjectItem } from 'src/types/TProjectItem'
import filterItems from './utils/filterItems'
import { TCredentials } from 'src/types/TCredentials'
import { Progress } from '../ui/progress'
import sleep from './utils/sleep'
import { addToLog } from '../../lib/addToLog'
import { LogStoredDataTypes } from '../../../../types/TLog'

const AutoUploader: FC = () => {
  const limit: number = 5;
  const timers = useLiveQuery(() => db.timer.toArray(), []) || [];

  const [count, setCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentTry, setCurrentTry] = useState<number>(0);
  const [currentItem, setCurrentItem] = useState<TProjectItem | null>(null);
  const [serviceMessage, setServiceMessage] = useState<string>('')
  const [countdown, setCountdown] = useState<number>(0)
  const [totalCountdown, setTotalCountdown] = useState<number>(0)

  const [open, setOpen] = useState<boolean>(false);

  const id:React.MutableRefObject<undefined|number> = useRef(undefined);

  useEffect(() => {
    let  interval:undefined|number = undefined
    if (totalCountdown) {
      setCountdown(totalCountdown)
      interval = window.setInterval(()=>{
        setCountdown(prevState => prevState-1)
      },1000)
    }
    return () => window.clearInterval(interval);
  }, [totalCountdown])

  const autoUpload = async (date: number, day: number):Promise<void> => {
    const tryLimit:number = limit;
    const shortCountDown:number = 5000
    const longCountdown:number = 60000
    const items = await db.projectItems.toArray() || []
    const credentials = await db.credentials.toArray() || []
    let uploadedItems = filterItems(items, date, day);

    await addToLog({
      created_at:new Date(),
      type:'Автозагрузка. Начало',
      isError:false,
      description:`Начало автозагрузки по расписанию для ${uploadedItems.length} таблиц(ы).`,
    })

    if (uploadedItems.length < 1 || credentials.length < 1) return;
    for (let i = 1; i <= tryLimit;) {
      setTotalCountdown(0)
      setTotalCount(uploadedItems.length);
      setCurrentTry(i);
      setServiceMessage("Данные загружаются...");
      uploadedItems = await uploadItems(uploadedItems, credentials[0])
        .then(res => {return res;});
      if (uploadedItems.length < 1) {
        setTotalCountdown(shortCountDown/1000)
        setServiceMessage("Все данные успешно загружены. Окно закроется через: ");
        const itemsAfterUpload = await db.projectItems.toArray() || []
        const logItems = filterItems(itemsAfterUpload, date, day);
        await addToLog({
          created_at:new Date(),
          type:'Автозагрузка. Конец',
          isError:false,
          description:`Данные успешно загружены для ${logItems.length} таблиц(ы).`,
          stored: { type:LogStoredDataTypes.projectItems, data: logItems }
        })
        await sleep(shortCountDown).then(()=>i = tryLimit+1)
      } else {
        if (i===tryLimit) {
          setTotalCountdown(shortCountDown/1000)
          setServiceMessage("Не все данные загружены, истекли попытки. Окно закроется через: ");
          const itemsAfterUpload = await db.projectItems.toArray() || []
          const logItems = filterItems(itemsAfterUpload, date, day);
          await addToLog({
            created_at:new Date(),
            type:'Автозагрузка. Конец',
            isError:true,
            description:`Не все данные были загружены. Не удалось загрузить ${uploadedItems.length} из ${logItems.length} таблиц(ы).`,
            stored: { type:LogStoredDataTypes.projectItems, data: logItems }
          })
          await sleep(shortCountDown).then(()=>i++)
        } else {
          setTotalCount(uploadedItems.length);
          setTotalCountdown(longCountdown/1000)
          setServiceMessage(`Не все данные загружены, переход к попытке №${i+1} через: `);
          await sleep(longCountdown).then(()=>i++)
        }
      }
    }
    setTotalCountdown(0)
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


  const counter = async (timer: Timer, delay: number):Promise<void> => {
    const currentHours = new Date().getHours();
    const currentMinutes = new Date().getMinutes();


    if (!timer) {
      id.current = window.setTimeout(() => {
        counter(timer, delay);
      }, delay);
      return;
    }

    if (!timer.active) {
      id.current = window.setTimeout(() => {
        counter(timer, delay);
      }, delay);
      return;
    }
    if (currentHours === timer.hh && currentMinutes === timer.mm) {
      setOpen(true);
      const todayDate = new Date().getDate();
      const todayDay = new Date().getDay();
      setOpen(true);
      await autoUpload(todayDate, todayDay)
        .finally(() => {
          setTotalCount(0);
          setOpen(false);
          setServiceMessage('')
          id.current = window.setTimeout(() => {
            counter(timer, delay);
          }, delay);
        });
      return;
    } else {
      id.current = window.setTimeout(() => {
        counter(timer, delay);
      }, delay);
      return;
    }
  };

  useEffect(() => {
    const timer = timers[0];
    counter(timer, 54000);
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
              <Text size='1'>{serviceMessage}{countdown>=1 && `${countdown} сек.`}</Text>
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
