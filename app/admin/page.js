"use client";
import React from "react";
import AdminPage from "./admin";
import ProtectedRoute from "../lib/protectedRoute";

const Page = () => {
  return (
    <>
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    </>
  );
};

export default Page;
