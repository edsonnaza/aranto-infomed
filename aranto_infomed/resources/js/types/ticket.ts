// types para el componente Ticket

export interface TicketPatient {
  full_name: string;
}

export interface TicketProfessional {
  full_name: string;
}

export interface TicketOrderItem {
  service_name: string;
  seguro_name?: string;
  quantity: number;
  total_price: number;
  professional: TicketProfessional;
}

export interface TicketOrder {
  items: TicketOrderItem[];
  seguro_name?: string;
  professional_name?: string;
}

export type TicketData = {
  visit_id?: number;
  created_at?: string;
  patient: {
    full_name: string;
  };
  order: {
    seguro_name?: string;
    professional_name?: string;
    items: {
      service_name: string;
      seguro_name?: string;
      quantity: number;
      total_price: number;
      professional?: {
        full_name: string;
      };
    }[];
  };
};

export type TicketProps = {
  data: TicketData | null;
};

