import React from "react";
import MobileHomepage from "./hompage";
import { NavbarDemo } from "@/components/Header";

const page = () => {
  return (
    <div>
      <NavbarDemo/>
      <MobileHomepage />
    </div>
  );
};

export default page;
