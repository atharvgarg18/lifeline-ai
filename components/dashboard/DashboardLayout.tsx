"use client";

import { useState } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f4f7fb]">
  <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
  
  <div className="flex-1 lg:ml-[270px] flex flex-col">
    <Header />

    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
</div>
  );
}