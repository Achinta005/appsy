import React from "react";
import ProfilePage from "./ProfilePage";
import ProtectedRoute from "@/app/lib/protectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
};

export default page;
