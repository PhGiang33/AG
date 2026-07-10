/**
 * Dinh nghia cac phong ban trong to chuc.
 * Su dung kieu union cua TypeScript giup an toan kieu du lieu va goi y code.
 */
export type Department = 'HR' | 'SALES' | 'MARKETING' | 'TECH' | 'FINANCE';

/**
 * Dinh nghia cac vai tro (role) he thong danh cho nguoi dung.
 * Giup tao ra he thong phan cap ro rang de kiem soat truy cap.
 */
export type SystemRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

/**
 * Dai dien cho mot muc menu trong cac thanh phan dieu huong nhu sidebar.
 * Thuoc tinh `requiredRoles` cho phep kiem soat hien thi chi tiet tung muc.
 */
export interface MenuItem {
  path: string;
  label: string;
  requiredRoles: SystemRole[];
}

/**
 * Kiem tra xem nguoi dung co quyen truy cap vao mot tai nguyen cua Agent hay khong.
 * Quyen duoc cap neu nguoi dung la ADMIN hoac phong ban cua ho nam trong danh sach cho phep.
 * Ham nay tap trung logic kiem tra quyen truy cap agent.
 * @param userDept Phong ban cua nguoi dung hien tai.
 * @param userRole Vai tro he thong cua nguoi dung hien tai.
 * @param allowedDepts Mang cac phong ban duoc phep truy cap vao tai nguyen.
 * @returns `true` neu nguoi dung co quyen truy cap, nguoc lai la `false`.
 */
export function hasAgentAccess(userDept: Department, userRole: SystemRole, allowedDepts: Department[]): boolean {
  // ADMIN co quyen truy cap vao tat ca, bo qua cac gioi han ve phong ban.
  if (userRole === 'ADMIN') {
    return true;
  }
  // Nguoi dung khong phai admin chi co quyen truy cap neu phong ban cua ho duoc phep.
  return allowedDepts.includes(userDept);
}

/**
 * Kiem tra xem nguoi dung co quyen truy cap vao mot bai viet hoac chuyen muc tri thuc hay khong.
 * Quyen duoc cap neu nguoi dung la ADMIN hoac phong ban cua ho nam trong pham vi cho phep.
 * Huu ich de loc cac noi dung chi danh rieng cho tung phong ban.
 * @param userDept Phong ban cua nguoi dung hien tai.
 * @param userRole Vai tro he thong cua nguoi dung hien tai.
 * @param allowedScopes Mang cac phong ban quy dinh pham vi hien thi.
 * @returns `true` neu nguoi dung co quyen truy cap, nguoc lai la `false`.
 */
export function hasKnowledgeAccess(userDept: Department, userRole: SystemRole, allowedScopes: Department[]): boolean {
  // ADMIN co the xem tat ca noi dung tri thuc.
  if (userRole === 'ADMIN') {
    return true;
  }
  // Nguoi dung khac chi co the xem noi dung thuoc pham vi phong ban cua ho.
  return allowedScopes.includes(userDept);
}

/**
 * Loc danh sach cac muc menu dua tren vai tro cua nguoi dung.
 * Ham nay dieu chinh dieu huong dong, dam bao nguoi dung chi thay cac link duoc phep truy cap.
 * Logic loc mang tinh bao ham; ADMIN xem duoc tat ca, MANAGER xem duoc cua MANAGER va EMPLOYEE...
 * @param userRole Vai tro he thong cua nguoi dung hien tai.
 * @param menuItems Danh sach day du cac muc menu can loc.
 * @returns Mot mang moi chi chua cac muc menu ma nguoi dung duoc phep xem.
 */
export function filterSidebarMenu(userRole: SystemRole, menuItems: MenuItem[]): MenuItem[] {
  const roleHierarchy: Record<SystemRole, number> = {
    ADMIN: 3,
    MANAGER: 2,
    EMPLOYEE: 1,
  };

  const userLevel = roleHierarchy[userRole];

  // Loc cac muc co it nhat mot quyen yeu cau thap hon hoac bang voi level cua nguoi dung.
  return menuItems.filter(item =>
    item.requiredRoles.some(requiredRole => userLevel >= roleHierarchy[requiredRole])
  );
}