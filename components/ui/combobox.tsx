"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboBoxProps {
  options: { label: string; value: string }[]
  value: string | string[]   // ✅ can be single string or array
  onChange: (value: string | string[]) => void
  heading: string
  multiple?: boolean         // ✅ single or multiple select
}

export const ComboBox = ({
  options,
  value,
  onChange,
  heading,
  multiple = false,
}: ComboBoxProps) => {
  const [open, setOpen] = React.useState(false)

  const isMulti = multiple
  const selectedValues = isMulti
    ? (value as string[])
    : [value as string]

  const handleSelect = (selectedValue: string) => {
    if (isMulti) {
      if (selectedValues.includes(selectedValue)) {
        onChange(selectedValues.filter((val) => val !== selectedValue))
      } else {
        onChange([...selectedValues, selectedValue])
      }
    } else {
      onChange(selectedValue)
      setOpen(false) // Close dropdown after single selection
    }
  }

  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-[400px] justify-between">
          {selectedLabels.length > 0
            ? selectedLabels.join(", ")
            : `Select ${heading.toLowerCase()}...`}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${heading.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  {isMulti && (
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  )}
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}