import { FC } from "react";
import PageLayout from "../components/PageLayout/pageLayout";
import AddCredentials from "../components/addCredentials/addCredentials";
import { Card, Flex, Heading } from "@radix-ui/themes";
import TimerSettings from "../components/timerSettings/timerSettings";

const Settings:FC = () => {
  return (
    <PageLayout>
        <Card>
          <Flex direction='column' gap='6'>
            <Heading my='3'>Настройки</Heading>
            <AddCredentials />
            <TimerSettings />
          </Flex>
        </Card>
    </PageLayout>
  );
};

export default Settings;
