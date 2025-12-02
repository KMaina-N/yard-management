"use server";
import { setHeaders } from "@/lib/set-headers";
import { cookies } from "next/headers";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export const getSupplierDashboardData = async () => {
    // const cookieStore = await cookies();
    // // console.log("Cookies in getSupplierDashboardData:", cookieStore.get('yard_management_session'));
    // const headers = new Headers()
    // headers.append('Cookie', `yard_management_session=${cookieStore.get('yard_management_session')?.value || ''}`);

    const headers = await setHeaders()

    try {
        const response = await fetch(`${BASE_URL}/api/supplier-dashboard`, { headers });
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error("Error fetching supplier dashboard data:", error);
    }
}