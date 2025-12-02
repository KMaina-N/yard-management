"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ChevronDown, Search, Settings } from "lucide-react";
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
import { sidebarItems } from "./data";

export function AppSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");

  // Normalize URL by removing /admin prefix
  const normalize = (url: string) => url.replace(/^\/admin/, "") || "/";

  const isActive = (url: string) => {
    const current = normalize(pathname);
    const target = normalize(url);
    return current === target || current.startsWith(`${target}/`);
  };

  // Expand parents if any child matches
  useEffect(() => {
    const newExpanded: Record<string, boolean> = {};
    sidebarItems.forEach((item) => {
      if (item.items) {
        const hasActiveChild = item.items.some((sub) => isActive(sub.url));
        if (hasActiveChild) newExpanded[item.title] = true;
      }
    });
    setExpandedItems(newExpanded);
  }, [pathname]);

  const toggleExpanded = (title: string) =>
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));

  // ✅ Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!query) return sidebarItems;

    const lowerQuery = query.toLowerCase();

    return sidebarItems
      .map((item) => {
        if (item.items) {
          const matchedSubItems = item.items.filter((sub) =>
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
      .filter(Boolean) as typeof sidebarItems;
  }, [query]);

  return (
    <Sidebar>
      {/* ---- Header ---- */}
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-6 items-center justify-center w-32 mx-2">
            <Image src={"/logo.png"} alt="Logo" width={500} height={500} />
          </div>
          <div>
            <h2 className="font-semibold">SlotWise</h2>
            <p className="text-muted-foreground text-xs">Yard Management</p>
          </div>
        </div>

        {/* ---- Search ---- */}
        <div className="px-2 mt-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-muted w-full rounded-2xl py-2 pr-4 pl-9"
            />
          </div>
        </div>
      </SidebarHeader>

      {/* ---- Content ---- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const parentActive =
                  isActive(item.url ?? "") ||
                  (item.items && item.items.some((sub) => isActive(sub.url)));

                return (
                  <SidebarMenuItem key={item.title}>
                    {item.items ? (
                      <Collapsible
                        open={expandedItems[item.title]}
                        onOpenChange={() => toggleExpanded(item.title)}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={cn(
                              "w-full justify-between rounded-2xl",
                              parentActive && "bg-gray-900 text-white"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {item.icon}
                              <span>{item.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-xs",
                                    parentActive && "bg-gray-900 text-white"
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform",
                                  expandedItems[item.title] ? "rotate-180" : ""
                                )}
                              />
                            </div>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => {
                              const active = isActive(subItem.url);
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={cn(
                                      "rounded-2xl",
                                      active && "bg-gray-800 text-white"
                                    )}
                                  >
                                    <a
                                      href={subItem.url}
                                      className="flex items-center justify-between"
                                    >
                                      {subItem.title}
                                      {subItem.badge && (
                                        <Badge
                                          variant="outline"
                                          className="rounded-full px-2 py-0.5 text-xs"
                                        >
                                          {subItem.badge}
                                        </Badge>
                                      )}
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "w-full justify-between rounded-2xl",
                          parentActive && "bg-gray-900 text-white"
                        )}
                      >
                        <a
                          href={item.url ?? "#"}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span>{item.title}</span>
                          </div>
                          {item.badge && (
                            <Badge
                              variant="outline"
                              className="rounded-full px-2 py-0.5 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ---- Footer ---- */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-2xl">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-2xl">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <span>Ali Imam</span>
                </div>
                <Badge variant="outline">Pro</Badge>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
