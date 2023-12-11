import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../ui/popover";
import { Button, Flex, ScrollArea } from "@radix-ui/themes";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../../../../ui/command";
import { cn } from "../../../../../lib/utils";
import { TProjectItem } from "../../../../../../../types/TProjectItem";

interface Props {
  item:TProjectItem
  titles:string[]
  setItem:(item:TProjectItem)=>void
}
const TitleSelect:React.FC<Props> = ({titles, setItem, item}) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")



  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="soft"
          role="combobox"
          aria-expanded={open}
        >
          <Flex justify='between' width='100%' align='center' >
            {value
              ? titles.find((title) => title.toLowerCase() === value.toLowerCase())
              : "Выберите лист для загрузки"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Flex>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Поиск листов таблицы..." />
          <CommandEmpty>Проекты не найдены</CommandEmpty>
          <CommandGroup>
            <ScrollArea style={{maxHeight:250}}>
              {titles.map((title) => (
                <CommandItem
                  key={title}
                  value={title}
                  onSelect={(currentValue) => {
                    setItem({...item, sheet_title:currentValue === item.sheet_title ? "" : titles.find(v=>v.toLowerCase()===currentValue.toLowerCase())!})
                    setValue(currentValue.toLowerCase() === value.toLowerCase() ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.toLowerCase() === title.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {title}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
};

export default TitleSelect
