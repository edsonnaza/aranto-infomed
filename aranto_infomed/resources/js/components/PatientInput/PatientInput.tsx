import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Patient } from "@/types/index"
import { useSearchPatients } from "@/hooks/index"
import { Card, CardContent } from "@/components/ui/card"

interface PatientInputProps {
  value: Patient | null
  onSelect: (patient: Patient | null) => void
}

export  function PatientInput({ value, onSelect }: PatientInputProps) {
  const [search, setSearch] = useState("")
  const results = useSearchPatients(search)

  return (
    <Card>
      <CardContent className="space-y-3">
        <h2 className="text-xl font-bold">Paciente</h2>
        <Input
          placeholder="Buscar paciente..."
          value={value ? value.full_name : search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={(e) => e.target.select()}
          onClick={() => {
            if (value) {
              onSelect(null); // Limpia el paciente seleccionado
              setSearch("");
            }
          }}
        />

        {results.length > 0 && search.length > 2 && !value && (
          <div className="border rounded p-2 max-h-40 overflow-y-auto">
            {results.map((p) => (
              <div
                key={p.id}
                className="cursor-pointer hover:bg-gray-100 p-1"
                onClick={() => {
                  onSelect(p)        // callback al componente padre
                  setSearch("")       // limpia input de búsqueda
                }}
              >
                {p.full_name} - {p.seguro_name ?? "Particular"}
              </div>
            ))}
          </div>
        )}

        {value && (
          <p className="text-sm text-green-600">
            ✔ {value.full_name} - {value.seguro_name ?? "Particular"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}


