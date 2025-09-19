import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// If 'NavItem' is not exported from '@/types', define it here or import the correct type.
// Example definition (customize as needed):
export type NavItem = {
  title: string;
  href?: string | null;
  icon?: React.ElementType;
  children?: { title: string; href: string }[];
};

// Or, if the correct type is exported under a different name, import it accordingly:
// import { CorrectTypeName as NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users as MedalIcon, WorkflowIcon, ReceiptCentIcon } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    title: 'Especialidades',
    href: '/especialidades',
    icon: BookOpen,
  },
  {
    title: 'Profesionales',
    href: '/profesionales',
    icon: MedalIcon,
  },
  {
    title: 'Tipos de Servicios',
    href: '/tipo-servicios',
    icon: WorkflowIcon,
  },
  {
    title: 'Recepción',
    icon: ReceiptCentIcon,
    href: null,
    children: [
      {
        title: 'Nueva visita',
        href: '/reception',
      },
      {
        title: 'Visitas registradas',
        href: '/reception/visits',
      },
    ],
  },
  {
    title: 'Tesorería',
    icon: Folder,
    href: null,
    children: [
      {
        title: 'Apertura de cajas',
        href: '/cash-register/openings',
      },
    ],
  },
]


const footerNavItems: NavItem[] = [
    {
        title: 'Aranto Infomed',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
