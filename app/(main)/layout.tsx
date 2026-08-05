import React from "react";
import { redirect } from "next/navigation";
import SideBar from "@/components/sidebar/SideBar";
import { getCurrentCompany } from "@/lib/auth";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const company = await getCurrentCompany();

  if (!company) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SideBar companyName={company.name} companyEmail={company.email} />
      <main className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(40rem_24rem_at_100%_-4%,rgb(99_102_241/0.07),transparent_55%),radial-gradient(36rem_22rem_at_-4%_0%,rgb(20_184_166/0.08),transparent_55%)]">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;