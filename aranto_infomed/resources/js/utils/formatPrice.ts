
/**
 * Formatea un número a formato moneda con separadores de miles.
 * Ejemplo: 5000000 => "5.000.000"
 */
export function formatPrice(value: number): string {
  if (isNaN(value)) return "0"
  return value.toLocaleString("es-ES") // separador de miles = "."
}

