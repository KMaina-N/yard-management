import { cookies } from "next/headers";
export const setHeaders = async () => {
  const cookieStore = await cookies();
  // console.log("Cookies in getSupplierDashboardData:", cookieStore.get('yard_management_session'));
  const headers = new Headers();
  headers.append(
    "Cookie",
    `yard_management_session=${
      cookieStore.get("yard_management_session")?.value || ""
    }`
  );
  return headers;
};
