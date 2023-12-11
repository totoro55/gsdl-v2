"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "../../../lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover"
import { Button, Flex } from "@radix-ui/themes";
import { TProject } from "../../../../../types/TPoject";
import { useEffect } from "react";


interface ProjectSelectProps {
  projects:TProject[]
  setSelectedProject:(project:TProject|undefined)=>void
}
const ProjectSelect:React.FC<ProjectSelectProps> = ({projects, setSelectedProject}) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  useEffect(() => {
    setValue('')
    setSelectedProject(undefined)
  }, [projects]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="surface"
          role="combobox"
          aria-expanded={open}
        >
          <Flex justify='between' align='center' style={{minWidth:278}}>
            {value
              ? projects.find((project) => project.name.toLowerCase() === value.toLowerCase())?.name
              : "Выберите проект"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Flex>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Поиск проекта.." />
          <CommandEmpty>Проекты не найдены</CommandEmpty>
          <CommandGroup>
            {projects.map((project) => (
              <CommandItem
                key={Number(project.id)}
                value={project.name}
                onSelect={(currentValue) => {
                  setSelectedProject(currentValue.toLowerCase() === value.toLowerCase() ? undefined : project)
                  setValue(currentValue.toLowerCase() === value.toLowerCase() ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.toLowerCase() === project.name.toLowerCase() ? "opacity-100" : "opacity-0"
                  )}
                />
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
};

export default ProjectSelect
