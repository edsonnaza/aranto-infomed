import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Professional } from "@/types"
import { useSearchProfessionals } from "@/hooks"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  professionals: Professional[]
  value: Professional | null
  onSelect: (prof: Professional) => void
}

export function ProfessionalInput({ professionals, value, onSelect }: Props) {
  const [search, setSearch] = useState("")
  const results = useSearchProfessionals(search, professionals)

  return (
    <Card>
      <CardContent className="space-y-3">
        <h2 className="text-xl font-bold">Profesional</h2>
        <Input
          placeholder="Buscar profesional..."
          value={value?.full_name || search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearch("")}
        />

        {results.length > 0 && search.length > 2 && !value && (
          <div className="border rounded p-2 max-h-40 overflow-y-auto">
            {results.map((p) => (
              <div
                key={p.id}
                className="cursor-pointer hover:bg-gray-100 p-1"
                onClick={() => {
                  onSelect(p)
                  setSearch("")
                }}
              >
                {p.full_name}
              </div>
            ))}
          </div>
        )}

        {value && (
          <p className="text-sm text-green-600">
            ✔ {value.full_name} seleccionado
          </p>
        )}
      </CardContent>
    </Card>
  )
}
