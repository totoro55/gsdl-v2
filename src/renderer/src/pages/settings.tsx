import { FC } from "react";
import PageLayout from "../components/PageLayout/pageLayout";
import AddCredentials from "../components/addCredentials/addCredentials";
import { Flex } from "@radix-ui/themes";
import TimerSettings from "../components/timerSettings/timerSettings";
import TgBotSettings from '../components/tgBotSettings/tgBotSettings'

const Settings:FC = () => {
  return (
    <PageLayout>
          <Flex direction='column' gap='6'>
            <AddCredentials />
            <TimerSettings />
            <TgBotSettings />
          </Flex>
    </PageLayout>
  );
};

export default Settings;
