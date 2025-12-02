"use client";

import { createContext, useContext } from "react";

export const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

export default function SessionProvider({ session, children }: any) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
