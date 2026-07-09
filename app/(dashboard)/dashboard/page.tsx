"use client";

import { useAppStore } from "@/lib/store";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";

export default function DashboardPage() {
  const { user } = useAppStore();

  if (user.role === "Admin") {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}
