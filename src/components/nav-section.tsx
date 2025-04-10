'use client';

import { type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function NavSection({
  title,
  items,
  isDisabled,
}: {
  title: string;
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  isDisabled?: boolean;
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.url === pathname;

          return (
            <SidebarMenuItem
              key={item.title}
              className={cn(isDisabled && 'cursor-not-allowed opacity-35')}
            >
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
                disabled={isDisabled}
                className={cn(
                  isDisabled &&
                    'hover:bg-inherit hover:text-inherit active:bg-inherit active:text-inherit',
                )}
              >
                {!isDisabled ? (
                  <Link
                    href={item.url}
                    onClick={() => {
                      if (isMobile) setOpenMobile(false);
                    }}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <span>
                    <item.icon />
                    <span>{item.title}</span>
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
