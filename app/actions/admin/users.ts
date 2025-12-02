"use server";
import {setHeaders} from '@/lib/set-headers';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const getAllUsers = async () => {
  const headers = await setHeaders();
  const res = await fetch(
    `${BASE_URL}/api/users`,
    { headers }
  );
  const data = await res.json();
  return data;
};

export const activateUser = async (userId: string) => {
    const headers = await setHeaders();
    try{
        // const res = await fetch
        console.log("USER ID:", userId);
        const res = await fetch(
            `${BASE_URL}/api/users/${userId}?activate=true`,
            {
                method: "PUT",
                headers,
                body: JSON.stringify({ accountActive: true }),
            }
        );
        if (!res.ok) {
            throw new Error("Failed to activate user.");
        }
        return await res.json();
    } catch (error) {
        console.error("Error activating user:", error);
        throw new Error("Failed to activate user.");

    }
}

export const editUser = async (userId: string, updatedData: any) => {
    const headers = await setHeaders();
    try {
        const res = await fetch(
            `${BASE_URL}/api/users/${userId}`,
            {
                method: "PUT",
                headers,
                body: JSON.stringify(updatedData),
            }
        );
        if (!res.ok) {
            throw new Error("Failed to edit user.");
        }
        return res
    } catch (error) {
        console.error("Error editing user:", error);
        throw new Error("Failed to edit user.");
    }
}