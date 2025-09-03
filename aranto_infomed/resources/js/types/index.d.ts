import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: string | null;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[]  | null;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    full_name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface EspecialidadProps {
  columns: {
    label: string;
    field: string;
  }[];
  data: {
    id: number;
    nombre: string;
    active: boolean;
    // agregar más campos según sea necesario
  }[];
  especialidades: unknown; // tipo desconocido, usar 'unknown' en vez de 'any'
}

export interface Items {
    id: number;
    service_name: string;
    status: string;
    quantity: number;
    unit_price: string;
    total_price: string;
}


export interface GenericDataTable {
  data: {
    data: Profesional[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    links: { url: string | null; label: string; active: boolean }[]
  }
}
