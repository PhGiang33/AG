// Trang chu cua ung dung
// Tu dong chuyen huong nguoi dung den trang dang nhap (login).

import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/login");
}
