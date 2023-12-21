import {  Card, Flex, Heading} from '@radix-ui/themes'
import { FC } from 'react'
import AddTokenForm from './components/addTokenForm'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

const TgBotSettings: FC = () => {

  return (
    <Card>
      <Flex direction="column" gap="3">

        <Heading size="3">Добавление оповещений через Telegram</Heading>
        <Accordion type="single" collapsible>
          <AccordionItem value="add-token">
            <AccordionTrigger>Добавление токена Telegram Bot&apos;а</AccordionTrigger>
            <AccordionContent>
              <AddTokenForm />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Flex>

    </Card>
  )
}

export default TgBotSettings
