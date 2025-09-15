
export type Professional = { 
    id: number; 
    name: string; 
    last_name: string; 
    full_name: string;
    active: boolean;
    commission_percentage?: number;
    email?: string;
    phone_number?: string;
    fecha_alta?: string;
    doc_cdi?: string;
    commission_interno?: string;
    commission_externo?: string;
}