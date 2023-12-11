import React from "react";
import { Button, Card, Flex } from "@radix-ui/themes";
import { CheckboxIcon, TableIcon } from "@radix-ui/react-icons";
import { TProjectItem } from "../../../../../types/TProjectItem";

interface Props {
  items:TProjectItem[]
  selectedItems:TProjectItem[]
  onGroupUpload:(items:TProjectItem[])=>Promise<void>
  isGroupUpload:boolean
}
const Footer:React.FC<Props> = ({items, selectedItems, onGroupUpload, isGroupUpload}) => {
  return (
    <Card>
      <Flex direction="row" width="100%" justify={"end"} gap={"3"} align="center">
        <Flex direction="row" gap="3" justify="start">
          <Button
            onClick={()=>onGroupUpload(selectedItems)}
            disabled={selectedItems.length<1 || isGroupUpload}
            variant='surface'>
            <CheckboxIcon />
            Загрузить выбранные
          </Button>
          <Button
            onClick={()=>onGroupUpload(items)}
            disabled={items.length<1 || isGroupUpload}>
            <TableIcon />
            Загрузить все
          </Button>
        </Flex>
      </Flex>
    </Card>

  );
};

export default Footer;
