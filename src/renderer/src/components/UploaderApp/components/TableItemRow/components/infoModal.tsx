import { Button, Dialog, Flex } from "@radix-ui/themes";
import { FC } from "react";
import ConfirmForm from "../../ProjectItemForm/components/ConfirmForm";
import { TProjectItem } from "../../../../../../../types/TProjectItem";

interface Props {
  item:TProjectItem
  open:boolean
  setOpen:(value:boolean)=>void
}
const InfoModal:FC<Props> = ({item, open, setOpen}) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content style={{ maxWidth: 350 }}>
        <Dialog.Title>Информация о таблице</Dialog.Title>
        <ConfirmForm item={item} />
        <Flex mt='3' justify='end'>
          <Dialog.Close>
            <Button variant='outline'>
              Закрыть
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default InfoModal;
