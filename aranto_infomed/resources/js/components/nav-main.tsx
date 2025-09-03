import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage()
  

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavItemWithChildren key={item.title} item={item} currentUrl={page.url} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavItemWithChildren({ item, currentUrl }: { item: NavItem; currentUrl: string }) {
const [open, setOpen] = useState(
  currentUrl.startsWith(item.href || '')
);


  // si tiene submenú
  if (item.children && item.children.length > 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => setOpen(!open)}>
          {item.icon && <item.icon />}
          <span className='cursor-pointer'>{item.title}</span>
          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </SidebarMenuButton>
        {open && (
          <div className="ml-6 mt-1 flex flex-col space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.title}
                href={child.href!}
                className={`text-sm px-2 py-1 rounded-md hover:bg-accent ${currentUrl.startsWith(child.href!) ? 'bg-accent text-accent-foreground' : ''}`}
              >
                {child.title}

              </Link>
            ))}
          </div>
        )}
      </SidebarMenuItem>
    )
  }

  // si no tiene hijos, es link normal
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={currentUrl.startsWith(item.href || '')} tooltip={{ children: item.title }}>
        <Link href={item.href!} prefetch>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
