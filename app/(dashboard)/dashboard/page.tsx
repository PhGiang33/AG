"use client";

// Trang tong quan chinh
// Tu dong chuyen huong den bang dieu khien cua Admin hoac User dua tren Role.


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
