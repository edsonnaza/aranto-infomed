import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { es } from 'date-fns/locale';
import "react-day-picker/dist/style.css";

export interface DateRangeValue {
  from: Date | undefined;
  to: Date | undefined;
}

export function DateRangePicker({ value, onChange }: { value: DateRangeValue; onChange: (range: DateRangeValue) => void }) {
  const formatRange = (range: DateRangeValue) => {
    if (!range.from || !range.to) return "Seleccionar rango";
    const format = (d: Date) => `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth()+1).toString().padStart(2, "0")}-${d.getFullYear()}`;
    return `${format(range.from)} a ${format(range.to)}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[225px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatRange(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <DayPicker
          mode="range"
          selected={value}
          onSelect={(range) => onChange({ from: range?.from, to: range?.to })}
          numberOfMonths={2}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}
