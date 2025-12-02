"use client"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
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

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { SUPPLIERS } from "@/data/suppliers"

const suppliers = SUPPLIERS

const SelectSupplier = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const [open, setOpen] = React.useState(false)
  const [isOtherSupplier, setIsOtherSupplier] = React.useState(false)
  const [otherSupplierName, setOtherSupplierName] = React.useState("")

  const handleSelectSupplier = (name: string) => {
    const selected = suppliers.find((s) => s.name === name)
    if (selected) {
      onChange(selected.name)
      setIsOtherSupplier(false)
      setOtherSupplierName("")
      setOpen(false)
    }
  }

  const handleOtherSupplierToggle = () => {
    setIsOtherSupplier(!isOtherSupplier)
    if (!isOtherSupplier) onChange("")
  }

  const displayValue = isOtherSupplier
    ? otherSupplierName || "Enter supplier name..."
    : value || "Select supplier..."

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayValue}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search supplier..." className="h-9" />
          <CommandList>
            <CommandEmpty>No supplier found.</CommandEmpty>
            <CommandGroup>
              {suppliers.map((supplier) => (
                <CommandItem
                  key={supplier.name}
                  value={supplier.name}
                  onSelect={handleSelectSupplier}
                >
                  {supplier.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === supplier.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <Separator orientation="horizontal" />

        <div className="flex p-2 items-center">
          <Checkbox
            id="other-supplier"
            checked={isOtherSupplier}
            onCheckedChange={handleOtherSupplierToggle}
          />
          <Label htmlFor="other-supplier" className="ml-2">
            Other Supplier
          </Label>
        </div>

        {isOtherSupplier && (
          <div className="p-2">
            <Input
              type="text"
              placeholder="Enter supplier name"
              value={otherSupplierName}
              onChange={(e) => {
                setOtherSupplierName(e.target.value)
                onChange(e.target.value)
              }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}


export default SelectSupplier
