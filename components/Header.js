"use client";
import { useState } from "react";
import {
  Menu,
  MenuItem,
  HoveredLink,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { Menu as MenuIcon } from "lucide-react";

export function NavbarDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const toggleItem = (item) => {
    setActiveItem(activeItem === item ? null : item);
  };

  return (
    <>
      {/* Fixed Header - Rounded bottom */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-white/10 to-white/50 backdrop-blur-md border-b border-neutral-800 z-30 shadow-lg transition-transform duration-300 rounded-2xl">
        <div className="flex items-center justify-between py-4 px-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-600">Welcome</h1>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors"
          >
            <MenuIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <MenuItem
          item="Portfolio"
          isOpen={activeItem === "Portfolio"}
          onToggle={() => toggleItem("Portfolio")}
        >
          <div className="space-y-1">
            <HoveredLink href="/portfolio">Home</HoveredLink>
            <HoveredLink href="/portfolio/about">About</HoveredLink>
            <HoveredLink href="/portfolio/projects">Projects</HoveredLink>
            <HoveredLink href="/portfolio/contact">Contact</HoveredLink>
          </div>
        </MenuItem>

        <MenuItem
          item="Ml-models"
          isOpen={activeItem === "Ml-models"}
          onToggle={() => toggleItem("Ml-models")}
        >
          <div className="space-y-2">
            <ProductItem
              title="Uplift Model"
              href="/ml_model/uplift-model"
              src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1761832192/Uploaded_Images/yab455oxnwkmjj7xctnu.png"
              description="Developed a Causal Inference Engine using Propensity Score Matching (PSM) and T-Learner for accurate market attribution."
            />
            <ProductItem
              title="Medical Charge Prediction"
              href="/ml_model/medical-charge-prediction"
              src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1760261372/Uploaded_Images/icz1ccuq5dy2ioobmjsl.png"
              description="This project uses a Linear Regression model to predict an individual's annual medical charges."
            />
            <ProductItem
              title="Heart Disease Prediction"
              href="/ml_model/heart-disease-prediction"
              src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1760296788/Uploaded_Images/dwa0trnpoasgbja7maig.png"
              description="This project uses a Logistic Regression model to predict heart disease."
            />
            <ProductItem
              title="Customer Churn Prediction"
              href="/ml_model/customer-churn-prediction"
              src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1760369943/Uploaded_Images/sjyunfsiaycvwaxtxhug.png"
              description="This project uses a Random Forest machine learning model to predict customer churn."
            />
          </div>
        </MenuItem>
      </Menu>
    </>
  );
}

export default NavbarDemo;
