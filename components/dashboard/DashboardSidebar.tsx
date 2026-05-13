"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Video, 
  Calendar, 
  CreditCard, 
  Settings, 
  LayoutDashboard,
  LogOut,
  ChevronRight
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const menuOptions = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "My Videos",
    href: "/dashboard/videos",
    icon: Video,
  },
  {
    name: "Schedule Post",
    href: "/dashboard/schedule",
    icon: Calendar,
  },
  {
    name: "Pricing",
    href: "/dashboard/pricing",
    icon: CreditCard,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-sidebar/80 backdrop-blur-xl transition-all duration-300">
      <div className="flex h-full flex-col px-4 py-6">
        {/* Logo and App Name */}
        <Link 
          href="/dashboard" 
          className="mb-10 flex items-center gap-3 px-2 group transition-all"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(124,58,237,0.2)] group-hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] group-hover:scale-105 transition-all duration-300">
            <Video className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-cyan-500 animate-pulse border-2 border-sidebar" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            VidShort <span className="text-primary text-sm font-mono tracking-widest ml-1 opacity-80 uppercase font-black">AI</span>
          </span>
        </Link>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5">
          <div className="mb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            Main Menu
          </div>
          {menuOptions.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                  )} />
                  <span>{item.name}</span>
                </div>
                {isActive && <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="mt-auto pt-6 border-t border-border/40">
          <div className="mb-4 space-y-1.5">
            <Link
              href="/dashboard/settings"
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                pathname === "/dashboard/settings"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Settings className="h-5 w-5" />
              <span>User Settings</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3 border border-border/20 backdrop-blur-sm">
            <div className="flex-shrink-0 relative">
               <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 rounded-lg border-2 border-primary/20 hover:border-primary/50 transition-colors",
                    userButtonTrigger: "focus:shadow-none"
                  }
                }}
               />
               <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-[#1c1c27]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-foreground truncate">Account</span>
              <span className="text-[10px] text-muted-foreground/80 truncate">Manage Profile</span>
            </div>
            <Link 
              href="/dashboard/settings"
              className="ml-auto p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground/50 hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
