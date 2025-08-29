import { useEffect, useState } from "react"
import { ServiceItem } from "@/types/services"
export function useSearchServices(query: string, seguro?: { id: number }) {
 const [resultsServices, setResultsServices] = useState<ServiceItem[]>([])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 1) {
        const params = new URLSearchParams()
        params.append("q", query)
        if (seguro?.id) params.append("seguro_id", seguro.id.toString())

        fetch(`/reception/services/search?${params.toString()}`)
          .then(res => {
            if (!res.ok) throw new Error("Error al buscar servicios")
            return res.json()
          })
          .then(data => setResultsServices(data))
          .catch(() => setResultsServices([]))
      } else {
        setResultsServices([])
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [query, seguro])

  return resultsServices
}
