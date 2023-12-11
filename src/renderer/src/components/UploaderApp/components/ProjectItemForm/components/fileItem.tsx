import { FC } from "react";
import { Card, Flex, IconButton, Inset, Text } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";

interface Props {
  fileName:string
  onRemove:(fileName:string)=>void
}
const FileItem:FC<Props> = ({fileName, onRemove}) => {
  return (
    <Card>
      <Inset>
        <Flex align='center' gap='2' px='2' py='1'>
          <Text size='2'>
            {fileName}
          </Text>
          <IconButton
            onClick={()=>onRemove(fileName)}
            size='1' radius='full' variant='ghost' color='red'>
            <Cross2Icon />
          </IconButton>
        </Flex>
      </Inset>
    </Card>
  );
};

export default FileItem;
