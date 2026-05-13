import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - fixed on the left */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen transition-all duration-300">
        <div className="relative h-full">
          {/* Subtle background glow effects */}
          <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
          </div>

          {/* Content Wrapper */}
          <div className="p-8 lg:p-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
