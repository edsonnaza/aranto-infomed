import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

export function DatePicker({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const ref = React.useRef<HTMLInputElement>(null)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? value : "Seleccionar fecha"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <input
          ref={ref}
          type="date"
          className="border rounded px-2 py-1 w-full"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </PopoverContent>
    </Popover>
  )
}
