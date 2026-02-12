"use client";

import { AuthProvider } from "./context/authContext";

export default function ProtectedLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
