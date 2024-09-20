import { UserRole } from "../__generated__/types";

 {/* 한글로 변환된 값을 표시 */}
export const roleLabels: Record<UserRole, string> = {
  [UserRole.Client]: "고객",
  [UserRole.Owner]: "사장",
  [UserRole.Delivery]: "배달원"
};
