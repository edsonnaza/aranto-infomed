import { useEffect, useState } from "react"
import { Patient } from "@/types/patient"
export function useSearchPatients(query: string) {
  const [resultsPatients, setResultsPatients] = useState<Patient[]>([])

  useEffect(() => {
    if (query.length > 2) {
      fetch(`/reception/patients/search?q=${query}`)
        .then(res => res.json())
        .then(data => setResultsPatients(data))
        .catch(() => setResultsPatients([]))
    } else {
      setResultsPatients([])
    }
  }, [query])

  return resultsPatients
}
