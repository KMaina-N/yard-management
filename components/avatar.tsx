"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  LogOut,
  User,
  Settings,
  CreditCard,
  ShieldCheck,
  Check,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Cpu,
  Boxes,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/authentication";

const statusOptions = [
  { label: "Online", color: "bg-green-500" },
  { label: "Away", color: "bg-yellow-500" },
  { label: "Do not disturb", color: "bg-red-500" },
];

export function AvatarPopover({
  name = "John Carter",
  email = "john@saas.com",
  imageSrc,
  unreadNotifications = 3,
  currentStatus = "Online",
  onLogout,
}: {
  name?: string;
  email?: string;
  imageSrc?: string;
  unreadNotifications?: number;
  currentStatus?: string;
  onLogout?: () => void;
}) {

  const { setTheme } = useTheme();

  const handleLogout = () => {
    logout();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <Avatar className="border border-muted-foreground/20 shadow-sm">
            <AvatarImage src={imageSrc} />
            <AvatarFallback className="bg-gradient-to-br from-gray-800 to-black text-white">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {unreadNotifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] rounded-full text-white"
            >
              {unreadNotifications}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          side="bottom"
          align="end"
          className="w-72 p-2 rounded-xl shadow-xl border bg-popover/95 backdrop-blur-md animate-in zoom-in-90"
        >
          <DropdownMenuLabel className="pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={imageSrc} />
                <AvatarFallback className="bg-indigo-500 text-white text-lg">
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-0.5">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="gap-2">
            <Boxes className="h-4 w-4" />
            Delivery History
          </DropdownMenuItem>

          {/* ACCOUNT OPTIONS */}
          <DropdownMenuItem className="gap-2">
            <User className="h-4 w-4" />
            Account
          </DropdownMenuItem>

          <DropdownMenuItem className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadNotifications > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {unreadNotifications}
              </Badge>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Security
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSeparator />

          {/* LOGOUT */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
