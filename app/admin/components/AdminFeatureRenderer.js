"use client";

import { adminFeatures } from "../config/adminFeatures";

export default function AdminFeatureRenderer({
  featureKey,
  onBack,
  onFeatureSelect,
  userRole
}) {
  if (!featureKey) return null;

  const feature = adminFeatures[featureKey];

  if (!feature) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Feature not found</p>
          {onBack && (
            <button
              onClick={onBack}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Go back
            </button>
          )}
        </div>
      </div>
    );
  }

  const FeatureComponent = feature.component;

  return (
    <div className="h-full w-full overflow-auto custom-scrollbar">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7 0%, #ec4899 100%);
          border-radius: 10px;
          border: 2px solid rgba(15, 23, 42, 0.5);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9333ea 0%, #db2777 100%);
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: rgba(15, 23, 42, 0.5);
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #a855f7 rgba(15, 23, 42, 0.5);
        }
      `}</style>

      <FeatureComponent onFeatureSelect={onFeatureSelect}/>
    </div>
  );
}
