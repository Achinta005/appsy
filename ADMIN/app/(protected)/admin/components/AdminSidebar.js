"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, Menu, X, ShieldUser, User } from "lucide-react";
import {
  adminFeatures,
  GROUP_ORDER,
  GROUP_LABELS,
} from "../config/adminFeatures";

const COMPACT_W = 64;
const EXPANDED_W = 220;

// ── Static token maps (defined ONCE outside component, never recreated) ──────
const DARK = {
  sidebar: "bg-[#0e0e1a]/90 backdrop-blur-xl border-white/[0.06]",
  logo: "from-blue-500 to-blue-400",
  title: "text-slate-100",
  sub: "text-slate-500",
  navLabel: "text-slate-600",
  item: "text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]",
  itemActive: "text-blue-400 bg-blue-500/10",
  icon: "text-slate-500 group-hover:text-slate-300",
  iconActive: "text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]",
  divider: "bg-white/[0.05]",
  footer: "bg-white/[0.04] border-white/[0.06]",
  roleText: "text-blue-400",
  badge: "bg-red-500",
  mobile: "bg-blue-600",
};

const LIGHT = {
  sidebar: "bg-white/70 backdrop-blur-xl border-slate-200/60",
  logo: "from-blue-600 to-blue-500",
  title: "text-slate-800",
  sub: "text-slate-400",
  navLabel: "text-slate-400",
  item: "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70",
  itemActive: "text-blue-600 bg-blue-50",
  icon: "text-slate-400 group-hover:text-slate-700",
  iconActive: "text-blue-600",
  divider: "bg-slate-200/60",
  footer: "bg-slate-50/80 border-slate-200/60",
  roleText: "text-blue-600",
  badge: "bg-red-500",
  mobile: "bg-blue-500",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function Logo({ compact, t }) {
  return (
    <div
      className={`h-16 flex items-center gap-3 px-4 flex-shrink-0 border-b border-current/5`}
      style={{ borderColor: "inherit" }}
    >
      <div
        className={`w-8 h-8 min-w-[32px] rounded-lg bg-gradient-to-br ${t.logo}
                       flex items-center justify-center shadow-lg shadow-blue-500/25`}
      >
        <span className="text-white text-[13px] font-bold font-mono tracking-tight">
          <ShieldUser className="w-4 h-4" />
        </span>
      </div>
      {!compact && (
        <div className="overflow-hidden">
          <p
            className={`text-[15px] font-semibold ${t.title} truncate leading-tight tracking-tight`}
          >
            Admin Panel
          </p>
          <p className={`text-[11px] ${t.sub} truncate font-mono mt-0.5`}>
            Management Dashboard
          </p>
        </div>
      )}
    </div>
  );
}

function NavGroupLabel({ label, compact, collapsed, onToggle, t }) {
  if (compact) return <div className="h-4" />;
  return (
    <button
      onClick={onToggle}
      className={`group w-full flex items-center justify-between
                  px-3 pt-5 pb-1.5 rounded
                  hover:opacity-100 transition-opacity duration-150
                  ${t.navLabel} opacity-60`}
    >
      <span className="text-[10px] font-bold tracking-[0.15em] uppercase font-mono">
        {label}
      </span>
      <ChevronRight
        className={`w-3.5 h-3.5 transition-transform duration-200
                    ${collapsed ? "" : "rotate-90"}`}
      />
    </button>
  );
}

function NavItem({ featureKey, feature, active, compact, t, onSelect }) {
  const Icon = feature.icon;
  return (
    <button
      onClick={() => onSelect(featureKey)}
      title={compact ? feature.title : undefined}
      className={`group relative w-full flex items-center rounded-lg
                  transition-colors duration-150 outline-none
                  focus-visible:ring-2 focus-visible:ring-blue-500/50
                  ${compact ? "justify-center p-3.5" : "gap-3 px-3 py-3"}
                  ${active ? t.itemActive : t.item}`}
    >
      {active && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6
                         bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"
        />
      )}

      <Icon
        className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150
                        ${active ? t.iconActive : t.icon}`}
      />

      {!compact && (
        <>
          <span className="flex-1 text-left text-[13.5px] font-medium truncate tracking-tight">
            {feature.title}
          </span>
          {feature.badge ? (
            <span
              className={`${t.badge} text-white text-[10px] font-bold
                              px-1.5 py-0.5 rounded-full leading-none`}
            >
              {feature.badge}
            </span>
          ) : active ? (
            <ChevronRight className="w-4 h-4 opacity-40 flex-shrink-0" />
          ) : null}
        </>
      )}

      {compact && feature.badge && (
        <span
          className={`absolute top-1.5 right-1.5 w-2 h-2 ${t.badge} rounded-full`}
        />
      )}
    </button>
  );
}

function Footer({ userRole, compact, t, userProfile }) {
  return (
    <div className={`flex-shrink-0 px-3 py-3 border-t ${t.footer}`}>
      {compact ? (
        <div className="w-8 h-8 flex items-center justify-center rounded-4xl bg-slate-200">
          {userProfile && userProfile.avatar ? (
            <img
              src={userProfile.avatar}
              alt="User avatar"
              className="w-full h-full object-cover rounded-4xl"
            />
          ) : (
            <User className="w-4 h-4 text-slate-600" />
          )}
        </div>
      ) : (
        <p className={`text-[12px] ${t.sub} font-mono`}>
          Role:{" "}
          <span className={`${t.roleText} font-semibold`}>{userRole}</span>
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminSidebar({
  activeFeature,
  onFeatureSelect,
  userRole,
  theme,
  userProfile,
}) {
  const [compact, setCompact] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeGroup = useMemo(() => {
    const found = adminFeatures[activeFeature];
    return found ? (found.group ?? "general") : null;
  }, [activeFeature]);

  const [collapsedGroups, setCollapsedGroups] = useState(() => {
    const currentGroup = adminFeatures[activeFeature]?.group ?? null;
    const init = {};
    GROUP_ORDER.forEach((g) => {
      init[g] = g !== currentGroup;
    });
    return init;
  });

  useEffect(() => {
    if (activeGroup) {
      setCollapsedGroups((prev) =>
        prev[activeGroup] === false ? prev : { ...prev, [activeGroup]: false },
      );
    }
  }, [activeGroup]);

  const toggleGroup = useCallback((group) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  }, []);

  // Token map — memoised, only changes when theme switches
  const t = useMemo(() => (theme === "dark" ? DARK : LIGHT), [theme]);

  // Filtered features — memoised, only recalculates when userRole changes
  const features = useMemo(
    () =>
      Object.entries(adminFeatures).filter(([, f]) =>
        f.roles.includes(userRole),
      ),
    [userRole],
  );

  // Group features — sorted by GROUP_ORDER, keyed by raw group id
  const grouped = useMemo(() => {
    const map = {};
    features.forEach(([key, f]) => {
      const g = f.group ?? "general";
      if (!map[g]) map[g] = [];
      map[g].push([key, f]);
    });
    return GROUP_ORDER.filter((g) => map[g]?.length).map((g) => ({
      id: g,
      label: GROUP_LABELS[g] ?? g,
      items: map[g],
    }));
  }, [features]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSelect = useCallback(
    (key) => {
      onFeatureSelect(key);
      setMobileOpen(false);
    },
    [onFeatureSelect],
  );

  const w = compact ? COMPACT_W : EXPANDED_W;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((p) => !p)}
        className={`lg:hidden fixed top-3 left-3 z-50 p-2 ${t.mobile}
                     text-white rounded-lg shadow-lg`}
        style={{ WebkitAppRegion: "no-drag" }}
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: w, minWidth: w }}
        onMouseEnter={() => setCompact(false)}
        onMouseLeave={() => setCompact(true)}
        className={`relative h-screen flex flex-col flex-shrink-0
                    border-r transition-[width,min-width] duration-200 ease-out
                    ${t.sidebar}
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    fixed lg:sticky top-0 left-0 z-40`}
      >
        <Logo compact={compact} t={t} />

        {/* Nav */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {grouped.map(({ id, label, items }) => {
            const isCollapsed = !!collapsedGroups[id];
            return (
              <div key={id}>
                <NavGroupLabel
                  label={label}
                  compact={compact}
                  collapsed={isCollapsed}
                  onToggle={() => toggleGroup(id)}
                  t={t}
                />
                <div
                  style={
                    compact
                      ? undefined
                      : {
                          maxHeight: isCollapsed ? 0 : items.length * 50,
                          overflow: "hidden",
                          transition: "max-height 0.2s ease-out",
                        }
                  }
                >
                  <div className="space-y-0.5">
                    {items.map(([key, feature]) => (
                      <NavItem
                        key={key}
                        featureKey={key}
                        feature={feature}
                        active={activeFeature === key}
                        compact={compact}
                        t={t}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Divider */}
        <div className={`mx-3 h-px flex-shrink-0 ${t.divider}`} />

        <Footer
          userRole={userRole}
          compact={compact}
          t={t}
          userProfile={userProfile}
        />
      </aside>
    </>
  );
}
