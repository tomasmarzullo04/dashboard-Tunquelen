import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen gradient-mesh">
      <Sidebar />
      <div className="lg:pl-60">{children}</div>
    </div>
  );
}
