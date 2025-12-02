"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  BarChart,
  Briefcase,
  Building,
  ChevronDown,
  Factory,
  FileText,
  Home,
  Layers,
  LogOut,
  Search,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
// import { sidebarItems } from "./data";

const sidebarItems = [
  {
    title: "Core Operations",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: <Home />,
        badge: null,
        items: null,
      },
      {
        title: "Bookings",
        url: "/admin/bookings",
        icon: <Layers />,
        badge: "3",
        items: [
          { title: "All Bookings", url: "/admin/bookings" },
          {
            title: "Pending Approvals",
            url: "/admin/bookings/pending",
            badge: "2",
          },
          { title: "Reschedules", url: "/admin/bookings/reschedules" },
        ],
      },
      {
        title: "Documents",
        url: "/admin/documents",
        icon: <FileText />,
        badge: null,
        items: [
          { title: "Attachments", url: "/admin/documents/invoices" },
          // { title: "Delivery Notes", url: "/admin/documents/delivery-notes" },
          // { title: "Packing Lists", url: "/admin/documents/packing-lists" },
        ],
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Configurations",
        url: "/admin/configurations",
        icon: <Wrench />,
        badge: null,
        items: [
          { title: "Yards", url: "/admin/configurations/yards" },
          {
            title: "Product Types",
            url: "/admin/configurations/product-types",
          },
          // { title: "Suppliers", url: "/admin/suppliers" },
          { title: "Delivery Rules", url: "/admin/configurations/delivery-rules" },
          {title: "Supplier Rules", url: "/admin/configurations/supplier-rules" },
        ],
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: <Users />,
        badge: null,
        items: [
          { title: "All Users", url: "/admin/users/all-users" },
          { title: "Roles & Permissions", url: "/admin/users/roles" },
          { title: "Audit Logs", url: "/admin/users/logs" },
        ],
      },
      {
        title: "Reports",
        url: "/admin/reports",
        icon: <BarChart />,
        badge: null,
        items: [
          { title: "Daily Reports", url: "/admin/reports/daily" },
          { title: "Monthly Reports", url: "/admin/reports/monthly" },
          { title: "Custom Reports", url: "/admin/reports/custom" },
        ],
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: <Settings />,
        badge: null,
        items: [
          { title: "System Settings", url: "/admin/settings/system" },
          { title: "Notifications", url: "/admin/settings/notifications" },
          { title: "Integrations", url: "/admin/settings/integrations" },
        ],
      },
    ],
  },
];

const useSidebarState = (initialItems: any) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [query, setQuery] = useState("");

  const normalizeUrl = useCallback(
    (url: string) => url.replace(/^\/admin/, "") || "/",
    []
  );

  const isActive = useCallback(
    (url: string) => {
      const current = normalizeUrl(pathname);
      const target = normalizeUrl(url);

      return current === target;
    },
    [pathname, normalizeUrl]
  );

  // Auto-expand parents if any child is active
  useEffect(() => {
    const newExpanded: Record<string, boolean> = {};
    initialItems.forEach((group: any) => {
      group.items.forEach((item: any) => {
        if (item.items) {
          const hasActiveChild = item.items.some((sub: any) =>
            isActive(sub.url)
          );
          if (hasActiveChild) newExpanded[item.title] = true;
        }
      });
    });
    setExpandedItems(newExpanded);
  }, [pathname, initialItems, isActive]);

  const toggleExpanded = (title: string) =>
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));

  const filteredGroups = useMemo(() => {
    if (!query) return initialItems;

    const lowerQuery = query.toLowerCase();

    return initialItems
      .map((group: any) => {
        const filteredItems = group.items
          .map((item: any) => {
            if (item.items) {
              const matchedSubItems = item.items.filter((sub: any) =>
                sub.title.toLowerCase().includes(lowerQuery)
              );
              if (
                item.title.toLowerCase().includes(lowerQuery) ||
                matchedSubItems.length > 0
              ) {
                return {
                  ...item,
                  items: matchedSubItems,
                };
              }
            } else if (item.title.toLowerCase().includes(lowerQuery)) {
              return item;
            }
            return null;
          })
          .filter(Boolean);

        if (filteredItems.length > 0) {
          return {
            ...group,
            items: filteredItems,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [query, initialItems]);

  return {
    expandedItems,
    query,
    setQuery,
    toggleExpanded,
    filteredGroups,
    isActive,
  };
};

const SidebarButton = ({ href, children, isActive, isSub, onClick }: any) => {
  const baseClasses = cn(
    "flex w-full/10 items-center justify-between transition-all duration-200 rounded-lg cursor-pointer select-none",
    "text-sm font-medium group"
  );

  const spacing = isSub ? "pl-10 ml-1 pr-3 py-1.5" : "px-3.5 py-2";
  const textColor = isActive
    ? "text-white"
    : isSub
    ? "text-gray-600 hover:text-gray-500"
    : "text-gray-700 font-semibold hover:text-white";

  const bgColor = isActive
    ? isSub
      ? "bg-gray-800/60 shadow-md shadow-gray-700/20"
      : "bg-gray-800/80 shadow-lg shadow-gray-700/30"
    : isSub
    ? "hover:bg-gray-800/60 hover:text-white"
    : "hover:bg-gray-800/80";

  const content = (
    <div
      className={cn(baseClasses, spacing, textColor, bgColor)}
      onClick={onClick}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
};

const NavGroupTitle = ({ children }: any) => (
  <h3 className="text-xs font-bold text-gray-900 tracking-wider uppercase px-2 py-1 antialiased">
    {children}
  </h3>
);

export const AppSidebar = ({ ...props }) => {
  const {
    expandedItems,
    query,
    setQuery,
    toggleExpanded,
    filteredGroups,
    isActive,
  } = useSidebarState(sidebarItems);

  // Helper for rendering menu items
  const renderMenuItem = (item: any) => {
    const parentActive =
      isActive(item.url ?? "") ||
      (item.items && item.items.some((sub: any) => isActive(sub.url)));

    const isOpen = expandedItems[item.title];

    if (item.items) {
      // Collapsible Parent Item
      return (
        <div key={item.title} className="space-y-1">
          <SidebarButton
            isActive={parentActive}
            onClick={() => toggleExpanded(item.title)}
          >
            <div className="flex items-center gap-3">
              {item.icon && <div className="h-5 w-5">{item.icon}</div>}
              <span>{item.title}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <Badge variant={parentActive ? "secondary" : "default"}>
                  {item.badge}
                </Badge>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen ? "rotate-180" : ""
                )}
              />
            </div>
          </SidebarButton>

          {/* Custom Collapsible Implementation (using max-height for smooth CSS transition) */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="space-y-1 pt-0.5 relative">
              <div className="absolute w-[1px] h-full bg-linear-to-b from-blue-300 to-indigo-500 left-0"></div>
              {item.items.map((subItem: any) => (
                <SidebarButton
                  key={subItem.title}
                  href={subItem.url}
                  isActive={isActive(subItem.url)}
                  isSub
                >
                  <span className="truncate">{subItem.title}</span>
                  {subItem.badge && <Badge>{subItem.badge}</Badge>}
                </SidebarButton>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Simple Link Item
    return (
      <SidebarButton key={item.title} href={item.url} isActive={parentActive}>
        <div className="flex items-center gap-3">
          {item.icon && <div className="h-5 w-5">{item.icon}</div>}
          <span>{item.title}</span>
        </div>
        {item.badge && <Badge>{item.badge}</Badge>}
      </SidebarButton>
    );
  };

  return (
    <Sidebar {...props}>
      {/* 1. SidebarHeader (Used for TeamSwitcher/Workspace & Search) */}
      <SidebarHeader>
        {/* Logo and App Name */}
        <div className="flex items-center justify-between p-1">
          {/* <div className="flex items-center gap-3">
            <Factory className="h-7 w-7 text-indigo-500" />
            <h1 className="font-extrabold text-xl tracking-tight">
              SLOT<span className="text-indigo-500">WISE</span>
            </h1>
          </div>
          <Button className="text-gray-400 hover:text-white transition-colors p-1 rounded-md">
            <Briefcase className="h-5 w-5" />
          </Button> */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo_truck.png"
              alt="Logo"
              width={150}
              height={40}
              className="w-18"
            />
            {/* <h1 className="text-xl font-extrabold">Yard Manager</h1> */}
          </div>
        </div>

        {/* Current Workspace/Tenant Selector (Replaces TeamSwitcher) */}
        <div className="group relative cursor-pointer p-3 rounded-xl hover:rounded-r-xl bg-gray-900 hover:bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Workspace Icon with subtle hover effect */}
              <Building className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors duration-300" />

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                  Tokić d.d.
                </p>
                <p className="text-xs text-gray-500 group-hover:text-indigo-400 transition-colors duration-300">
                  Yard Management System
                </p>
              </div>
            </div>

            {/* Chevron rotates on hover for interaction feedback */}
            <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-white transition-transform duration-300 group-hover:rotate-180" />
          </div>

          {/* Optional accent indicator bar on the left */}
          {/* <span className="absolute -left-1 top-0 h-full w-1 rounded-l-xl bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span> */}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="text-gray-500 absolute top-2.5 left-3 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search menu or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9"
          />
        </div>
      </SidebarHeader>

      {/* 2. SidebarContent (Used for NavMain/NavProjects) */}
      <SidebarContent className="custom-scrollbar">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group: any) => (
            <div key={group.title} className="space-y-1.5">
              <NavGroupTitle>{group.title}</NavGroupTitle>
              <nav className="space-y-1 px-2">
                {group.items.map(renderMenuItem)}
              </nav>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-6 w-6 mx-auto mb-2" />
            <p>No results found for "{query}"</p>
          </div>
        )}
      </SidebarContent>

      {/* 3. SidebarFooter (Used for NavUser/Profile) */}
      <SidebarFooter>
        <div className="space-y-2">
          {/* Settings Button */}
          <SidebarButton href="#" isActive={isActive("/admin/settings/system")}>
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5" />
              <span>Global Settings</span>
            </div>
          </SidebarButton>

          {/* User Profile (Replaces NavUser) */}
          <div className="group flex w-full items-center justify-between cursor-pointer p-3 rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>KM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-white">Kelvin Maina</p>
                <p className="text-xs text-indigo-400">kelvin.maina@tokic.hr</p>
              </div>
            </div>
            <LogOut className="h-5 w-5 text-gray-500 group-hover:text-red-400" />
          </div>
        </div>
      </SidebarFooter>

      {/* Custom Scrollbar Styling (for the scrollable content div) */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; /* gray-950 background */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280; /* gray-500 */
        }
      `}</style>
    </Sidebar>
  );
};

export default AppSidebar;
