import { FC, useEffect, useState } from "react";
import { TProjectItem } from "../../../../../../../types/TProjectItem";
import { Badge, Flex, HoverCard, Separator, Strong, Text } from "@radix-ui/themes";
import { Accordion } from "@renderer/components/ui/accordion";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../../../../ui/accordion";
import { ERROR_TYPES } from "../../../../../../../constants/errorTypes";
import { TResponseError } from "../../../../../../../types/TResponseError";

const errors = ERROR_TYPES
interface Props {
    item:TProjectItem
}
const StatusMessage:FC<Props> = ({item}) => {
  const [errDesc, setErrDesc] = useState<TResponseError|undefined>(undefined)

  useEffect(() => {
    if (item.status_code && item.status_code!==200) {
      const errMsg = errors.find(err=>item.status_message?.toLowerCase().includes(err.searchValue.toLowerCase()))
      setErrDesc(errMsg)
    }
  }, [item.status_message]);

  return (
    <HoverCard.Root closeDelay={1000}>
      <HoverCard.Trigger>
        <Badge color={item.status_code === 200 ?'green' :'red'}>
          {!item.status_code && '-'}
          {item.status_code===200 && 'Загружено'}
          {item.status_code!==200 && item.status_code && 'Ошибка'}
        </Badge>
      </HoverCard.Trigger>
      <HoverCard.Content size="1" >
        <Flex direction='column' gap='2' style={{maxWidth:300}}>
          <Text size='1' color={item.status_code === 200 ?'green' :'red'} weight='bold'>
            {!item.status_code && 'Нет данных'}
            {item.status_code!==200 && item.status_code && 'Ошибка'}
            {item.status_code===200 && item.status_code && 'Данные загружены'}
          </Text>
          {item.status_code!==200 && item.status_code &&
            <Text size='1' color='gray'>
              <Strong>{item.status_code}</Strong> : {item.status_message}
            </Text>
          }
          {item.status_code!==200 && item.status_code &&
            <Accordion type="single" className='-mt-2' collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <Text size='1'>
                    Расшифровка ошибки
                  </Text>
                </AccordionTrigger>
                <AccordionContent>
                  <Flex direction='column' gap='2' justify='center'>
                    {errDesc?.critical &&
                      <Flex>
                        <Badge variant='solid' color='red'>
                          Критическая ошибка
                        </Badge>
                      </Flex>
                    }
                    <Text size='1' color='gray'>
                      {!errDesc && 'Нет расшифровки данной ошибки'}
                      {errDesc && errDesc.description}
                    </Text>
                  </Flex>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          }
          {item.status_code===200 && item.status_code && <Separator size='4' />}
          {item.status_date_time &&
              <Text size='1' color='gray'>
                Обновлено: {item.status_date_time}
              </Text>
          }
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  );
};

export default StatusMessage;
