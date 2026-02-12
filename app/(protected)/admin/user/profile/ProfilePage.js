"use client";
import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, MapPin, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import UserPageLayout from "../../components/useLayout";
import useUserProfile from "@/hooks/useUserdata";

export default function ProfilePage() {
  const { userProfile, loading, error } = useUserProfile();
  const [theme, setTheme] = useState("light");

  // Initialize and listen for theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);

    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        setTheme(e.newValue || "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isDark = theme === "dark";

  // Theme-based styles
  const loaderColor = isDark ? "text-purple-400" : "text-purple-600";
  const errorBg = isDark ? "bg-red-900/20 border-red-500/30" : "bg-red-100 border-red-300";
  const errorTitle = isDark ? "text-red-400" : "text-red-700";
  const errorText = isDark ? "text-gray-400" : "text-gray-600";
  
  const cardBg = isDark ? "bg-slate-800/50 border-white/10" : "bg-white border-purple-200";
  const headerGradient = isDark 
    ? "from-purple-600 to-pink-600" 
    : "from-purple-500 to-pink-500";
  
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const textMuted = isDark ? "text-gray-300" : "text-gray-700";
  
  const infoBg = isDark ? "bg-white/5" : "bg-purple-50";
  const iconColor = isDark ? "text-purple-400" : "text-purple-600";
  const editBtnBg = isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600";
  
  const quickCardBg = isDark ? "bg-slate-800/50 border-white/10 hover:border-purple-500/50" : "bg-white border-purple-200 hover:border-purple-400";
  const badgeBg = isDark ? "from-purple-600 to-purple-700 border-slate-900" : "from-purple-500 to-purple-600 border-white";

  if (loading) {
    return (
      <UserPageLayout username="Loading...">
        <div className="flex items-center justify-center py-20">
          <Loader2 className={`w-12 h-12 ${loaderColor} animate-spin`} />
        </div>
      </UserPageLayout>
    );
  }

  if (error) {
    return (
      <UserPageLayout username="Error">
        <div className={`${errorBg} backdrop-blur-xl rounded-2xl border p-8 text-center`}>
          <h2 className={`${errorTitle} text-xl font-bold mb-2`}>Failed to load profile</h2>
          <p className={textSecondary}>{error}</p>
        </div>
      </UserPageLayout>
    );
  }

  if (!userProfile) return null;

  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className={`flex items-center gap-3 ${textMuted} p-3 ${infoBg} rounded-lg transition-colors`}>
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
      <div className="flex-1">
        <p className={`text-xs ${textSecondary} mb-0.5`}>{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );

  return (
    <UserPageLayout username={userProfile.username}>
      <div className={`${cardBg} backdrop-blur-xl rounded-2xl border overflow-hidden transition-colors shadow-xl`}>
        <div className={`h-32 bg-gradient-to-r ${headerGradient} relative`}>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="p-6 -mt-14 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 flex items-center justify-center border-4 ${isDark ? 'border-slate-900' : 'border-white'} shadow-2xl relative overflow-hidden transition-transform duration-300 hover:scale-105`}>
                {!userProfile.avatar ? (
                  <User className="w-16 h-16 text-white drop-shadow-lg" />
                ) : (
                  <img src={userProfile.avatar} alt="User avatar" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {userProfile.role === "admin" && (
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r ${badgeBg} text-white text-xs px-3 py-1 rounded-full font-bold border-2 shadow-lg backdrop-blur-sm animate-pulse`}>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping absolute" />
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full mr-1" />
                    Admin
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className={`${textPrimary} text-3xl font-bold`}>{userProfile.fullName}</h1>
              <p className={`${textSecondary} text-lg`}>@{userProfile.username}</p>
              <p className={`${textMuted} mt-2 max-w-2xl`}>{userProfile.bio}</p>
            </div>

            <Link href="/admin/user/settings" className={`px-6 py-2 ${editBtnBg} text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg`}>
              <Edit className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            <InfoCard icon={Mail} label="Email" value={userProfile.email} />
            <InfoCard icon={Phone} label="Phone" value={userProfile.phone} />
            <InfoCard icon={MapPin} label="Location" value={userProfile.location} />
            <InfoCard icon={Calendar} label="Member Since" value={`Joined ${userProfile.joinedDate}`} />
          </div>

          <div className={`mt-6 p-4 ${infoBg} rounded-xl transition-colors`}>
            <h3 className={`${textPrimary} font-semibold mb-3 flex items-center gap-2`}>
              <User className={`w-4 h-4 ${iconColor}`} />
              Account Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className={textSecondary}>Username</p>
                <p className={`${textPrimary} font-medium`}>@{userProfile.username}</p>
              </div>
              <div>
                <p className={textSecondary}>Last Updated</p>
                <p className={`${textPrimary} font-medium`}>{userProfile.lastLogin}</p>
              </div>
              <div>
                <p className={textSecondary}>Account Type</p>
                <p className={`${textPrimary} font-medium capitalize`}>{userProfile.role}</p>
              </div>
              <div>
                <p className={textSecondary}>Profile Visibility</p>
                <p className={`${textPrimary} font-medium`}>Public</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Edit, title: "Edit Profile", desc: "Update your personal information", color: "purple" },
          { icon: Mail, title: "Notifications", desc: "Manage your notification preferences", color: "blue" },
          { icon: MapPin, title: "Privacy", desc: "Control your privacy settings", color: "pink" }
        ].map(({ icon: Icon, title, desc, color }) => (
          <Link 
            key={title} 
            href="/admin/user/settings" 
            className={`p-4 ${quickCardBg} backdrop-blur-xl rounded-xl border transition-all group shadow-lg`}
          >
            <Icon className={`w-8 h-8 ${color === 'purple' ? iconColor : color === 'blue' ? 'text-blue-500' : 'text-pink-500'} mb-2 group-hover:scale-110 transition-transform`} />
            <h3 className={`${textPrimary} font-semibold`}>{title}</h3>
            <p className={`${textSecondary} text-sm mt-1`}>{desc}</p>
          </Link>
        ))}
      </div>
    </UserPageLayout>
  );
}