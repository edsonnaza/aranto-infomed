import * as Select from "@radix-ui/react-select"
import { Seguro } from "@/types"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  seguros: Seguro[]
  value: Seguro | null
  onChange: (s: Seguro) => void
}

export function SeguroSelect({ seguros, value, onChange }: Props) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <h2 className="text-xl font-bold">Seguro</h2>
        <Select.Root
          value={value?.id?.toString() || ""}
          onValueChange={(val) => {
            const s = seguros.find((s) => s.id.toString() === val)
            if (s) onChange(s)
          }}
        >
          <Select.Trigger className="w-full border rounded px-3 py-2 flex justify-between items-center">
            <Select.Value placeholder="Selecciona un seguro" />
            <Select.Icon />
          </Select.Trigger>

          <Select.Content className="bg-white border rounded shadow-md mt-1 z-50">
            <Select.ScrollUpButton />
            <Select.Viewport className="p-1 max-h-60 overflow-y-auto">
              {seguros.map((s) => (
                <Select.Item
                  key={s.id}
                  value={s.id.toString()}
                  className="px-3 py-1 cursor-pointer rounded hover:bg-gray-100"
                >
                  <Select.ItemText>{s.name}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton />
          </Select.Content>
        </Select.Root>

        {value && (
          <p className="text-sm text-green-600">✔ Seguro seleccionado: {value.name}</p>
        )}
      </CardContent>
    </Card>
  )
}
