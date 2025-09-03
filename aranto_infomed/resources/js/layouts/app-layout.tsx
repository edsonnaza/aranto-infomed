import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
  const { props: pageProps } = usePage<{
    flash?: { success?: string; error?: string; warning?: string};
  }>();

  useEffect(() => {
    if (pageProps.flash?.success) {
      toast.success(pageProps.flash.success);
    }
    if (pageProps.flash?.error) {
      toast.error(pageProps.flash.error);
    }
      if (pageProps.flash?.warning) {
        toast.warning(pageProps.flash.warning);
    }
  }, [pageProps.flash]);

  return (
    <>
      <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
      </AppLayoutTemplate>
      <Toaster richColors closeButton />
    </>
  );
};
