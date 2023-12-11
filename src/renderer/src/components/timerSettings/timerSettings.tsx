import { FC, useEffect, useState } from "react";
import { Box, Button, Card, Flex, Heading, Select, Separator, Switch, Text } from "@radix-ui/themes";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";
import { toast } from "../ui/use-toast";
import { Timer } from "../../../../types/Timer";
import { HOURS, MINUTES } from "../../../../constants/time";

const minutes = MINUTES;
const hours = HOURS;

const initTimer: Timer = {
  active: false,
  hh: 0,
  mm: 0
};


const TimerSettings: FC = () => {
  const [currentTimer, setCurrentTimer] = useState<Timer>(initTimer);
  const timer = useLiveQuery(() => db.timer.toArray(), []) || [];

  useEffect(() => {
    if (timer.length >= 1) {
      setCurrentTimer(timer[0]);
    }
  }, [timer]);

  const saveTimer = async (): Promise<void> => {
    if (timer.length < 1) {
      await db.timer.add({ active: currentTimer.active, hh: currentTimer.hh, mm: currentTimer.mm })
        .then(()=>toast({ title: "Настройки таймера успешно сохранены"}))
        .catch(err => toast({ variant: "destructive", title: "Ошибка", description: err.message }));
      return;
    } else {
      await db.timer.update(timer[0].id!, { active: currentTimer.active, hh: currentTimer.hh, mm: currentTimer.mm })
        .then(()=>toast({ title: "Настройки таймера успешно обновлены"}))
        .catch(err => toast({ variant: "destructive", title: "Ошибка", description: err.message }));
      return;
    }
  };

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Heading size="3">Таймер автозагрузки</Heading>
        <Separator size="4" />
        <Flex direction="row" gap="6" justify="start" align="center">
          <label>
            <Box style={{ width: 130 }}>
              <Flex align="center" width="100%" direction="row" justify="between" gap="3">
                <Text size="2">
                  {!currentTimer.active ? "Выключен" : "Включен"}
                </Text>
                <Switch
                  onCheckedChange={checked => setCurrentTimer({ ...currentTimer, active: checked })}
                  checked={currentTimer.active}
                  color="green" />
              </Flex>
            </Box>
          </label>
          <Separator orientation="vertical" />
          <Flex align="center" gap="3">

            <Text size="2">
              Время автозагрузки:
            </Text>
            <Select.Root size="2"
                         disabled={!currentTimer.active}
                         value={currentTimer.hh.toString()}
                         onValueChange={value => setCurrentTimer({ ...currentTimer, hh: Number(value) })}>
              <Select.Trigger variant="ghost" placeholder="Часы" />
              <Select.Content position={"item-aligned"}>
                {hours.map(h => (
                  <Select.Item key={h.value} value={h.value.toString()}>{h.title}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <Separator orientation="vertical" />
            <Select.Root size="2"
                         disabled={!currentTimer.active}
                         value={currentTimer.mm.toString()}
                         onValueChange={value => setCurrentTimer({ ...currentTimer, mm: Number(value) })}>
              <Select.Trigger variant="ghost" placeholder="Минуты" />
              <Select.Content position={"item-aligned"}>
                {minutes.map(m => (
                  <Select.Item key={m.value} value={m.value.toString()}>{m.title}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
          <Separator orientation="vertical" />
          <Button
            disabled={currentTimer.active === timer[0]?.active && currentTimer.hh === timer[0]?.hh && currentTimer.mm === timer[0]?.mm}
            onClick={saveTimer}
            size="2" variant="solid" color="green">
            Сохранить
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default TimerSettings;
