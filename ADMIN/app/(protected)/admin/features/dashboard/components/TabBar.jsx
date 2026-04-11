export default function TabBar({ activeTab, setActiveTab, theme }) {
  const isDark = theme === "dark";

  const tabActive = isDark
    ? "bg-white/20 text-white border-white/30"
    : "bg-purple-100 text-purple-700 border-purple-300";

  const tabInactive = isDark
    ? "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200";

  const TABS = [
    { id: "overview",    label: "Overview" },
    { id: "analytics",  label: "Analytics" },
    { id: "security",   label: "Security" },
    { id: "users",      label: "Users" },
    { id: "activities", label: "Activities" },
    { id: "services",   label: "Services" },
    { id: "monitoring", label: "Monitoring" },
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === tab.id ? tabActive : tabInactive
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}