import React from "react";
import SettingsPage from "./SettingsPage";
import ProtectedRoute from "@/app/(protected)/lib/protectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  );
};

export default page;
