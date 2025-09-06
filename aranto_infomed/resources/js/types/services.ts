export type ServiceItem = { 
    id: number; 
    name: string; 
    professional: {id: number; full_name: string};
    price_sale: number; 
    qty: number; 
    discount_percent: number; 
    discount_amount: number;
    seguro_id: number; 
    seguro_name: string 
}