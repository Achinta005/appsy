"use client";
import { User, Mail, Phone, Calendar, MapPin, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import UserPageLayout from "../../components/useLayout";
import useUserProfile from "@/hooks/useUserdata";

export default function ProfilePage() {
  const { userProfile, loading, error } = useUserProfile();

  if (loading) {
    return (
      <UserPageLayout username="Loading...">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
        </div>
      </UserPageLayout>
    );
  }

  if (error) {
    return (
      <UserPageLayout username="Error">
        <div className="bg-red-900/20 backdrop-blur-xl rounded-2xl border border-red-500/30 p-8 text-center">
          <h2 className="text-red-400 text-xl font-bold mb-2">Failed to load profile</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </UserPageLayout>
    );
  }

  if (!userProfile) return null;

  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 text-gray-300 p-3 bg-white/5 rounded-lg">
      <Icon className="w-5 h-5 text-orange-400 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );

  return (
    <UserPageLayout username={userProfile.username}>
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-orange-500 to-red-500 relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="p-6 -mt-14 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 flex items-center justify-center border-4 border-slate-900 shadow-2xl relative overflow-hidden transition-transform duration-300 hover:scale-105">
                {!userProfile.avatar ? (
                  <User className="w-16 h-16 text-white drop-shadow-lg" />
                ) : (
                  <img src={userProfile.avatar} alt="User avatar" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {userProfile.role === "admin" && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs px-3 py-1 rounded-full font-bold border-2 border-slate-900 shadow-lg backdrop-blur-sm animate-pulse">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping absolute" />
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full mr-1" />
                    Admin
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-white text-3xl font-bold">{userProfile.fullName}</h1>
              <p className="text-gray-400 text-lg">@{userProfile.username}</p>
              <p className="text-gray-300 mt-2 max-w-2xl">{userProfile.bio}</p>
            </div>

            <Link href="/admin/user/settings" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
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

          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-400" />
              Account Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Username</p>
                <p className="text-white font-medium">@{userProfile.username}</p>
              </div>
              <div>
                <p className="text-gray-400">Last Updated</p>
                <p className="text-white font-medium">{userProfile.lastLogin}</p>
              </div>
              <div>
                <p className="text-gray-400">Account Type</p>
                <p className="text-white font-medium capitalize">{userProfile.role}</p>
              </div>
              <div>
                <p className="text-gray-400">Profile Visibility</p>
                <p className="text-white font-medium">Public</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Edit, title: "Edit Profile", desc: "Update your personal information", color: "orange" },
          { icon: Mail, title: "Notifications", desc: "Manage your notification preferences", color: "blue" },
          { icon: MapPin, title: "Privacy", desc: "Control your privacy settings", color: "purple" }
        ].map(({ icon: Icon, title, desc, color }) => (
          <Link key={title} href="/admin/user/settings" className="p-4 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-white/10 hover:border-orange-500/50 transition-all group">
            <Icon className={`w-8 h-8 text-${color}-400 mb-2 group-hover:scale-110 transition-transform`} />
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-gray-400 text-sm mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </UserPageLayout>
  );
}