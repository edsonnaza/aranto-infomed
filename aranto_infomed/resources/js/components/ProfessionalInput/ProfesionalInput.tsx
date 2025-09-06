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
import { Card, CardContent } from "@/components/ui/card"
import { Professional } from "@/types"

interface Props {
  professionals: Professional[]
  value: Professional | null
  onSelect: (prof: Professional | null) => void
}

export function ProfessionalInput({ professionals, value, onSelect }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
   <Card>
      <CardContent className="space-y-3">
        <h2 className="text-xl font-bold">Profesional</h2>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value ? value.full_name : "Seleccionar profesional..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar profesional..." />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {professionals.map((prof) => (
                  <CommandItem
                    key={prof.id}
                    value={prof.full_name}
                    onSelect={() => {
                      onSelect(prof)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?.id === prof.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {prof.full_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
         {value && (
          <p className="text-sm text-green-600">
            ✔ Profesional seleccionado: {value.name}
          </p>
        )}
      </Popover>
    </CardContent>
    </Card>
  )
}
