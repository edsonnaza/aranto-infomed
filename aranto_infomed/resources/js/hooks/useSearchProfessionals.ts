import { useEffect, useState } from "react"
import { Professional } from "@/types/professional"
export function useSearchProfessionals(query: string, professionals: Professional[]) {
  const [resultsProfessionals, setResultsProfessionals] = useState<Professional[]>([])

  useEffect(() => {
    if (query.length > 1) {
      setResultsProfessionals(
        professionals.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase())
        )
      )
    } else {
      setResultsProfessionals([])
    }
  }, [query, professionals])

  return resultsProfessionals
}
