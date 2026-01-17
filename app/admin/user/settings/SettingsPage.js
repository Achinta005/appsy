"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Save, User, Lock, Eye, Trash2, Loader2, SquarePen, Check, X } from "lucide-react";
import Cropper from "react-easy-crop";
import UserPageLayout from "../../components/useLayout";
import useUserProfile from "@/hooks/useUserdata";

export default function SettingsPage() {
  const { userProfile, profileImage, loading: profileLoading, updateUserProfile, updateProfileImage } = useUserProfile();
  
  const [settings, setSettings] = useState({});
  const [image, setImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageError, setImageError] = useState(null);
  const [theme, setTheme] = useState("light");
  const fileInputRef = useRef(null);

  // Initialize and listen for theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        setTheme(e.newValue || "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (userProfile) {
      setSettings({
        username: userProfile.username || "",
        email: userProfile.email || "",
        fullName: userProfile.fullName || "",
        bio: userProfile.bio || "",
        phone: userProfile.phone || "",
        location: userProfile.location || "",
        notifications: userProfile.notifications ?? true,
        emailAlerts: userProfile.emailAlerts ?? true,
        profileVisibility: userProfile.profileVisibility || "public",
      });
    }
  }, [userProfile]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5MB");
      return;
    }

    setImageError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCropperClose = useCallback(() => {
    setShowCropper(false);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const getCroppedImage = useCallback(async () => {
    if (!image || !croppedAreaPixels) return;

    setIsUploading(true);
    setImageError(null);

    try {
      const croppedBlob = await cropImage(image, croppedAreaPixels);
      await updateProfileImage(croppedBlob);
      
      setShowCropper(false);
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      setMessage({ type: "success", text: "Profile picture updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setImageError("Failed to process the image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [image, croppedAreaPixels, updateProfileImage]);

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await updateUserProfile(settings);
      setMessage({ type: "success", text: "Settings updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update settings" });
    } finally {
      setLoading(false);
    }
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const loaderColor = isDark ? "text-purple-400" : "text-purple-600";
  const cardBg = isDark ? "bg-slate-800/50 border-white/10" : "bg-white border-purple-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const iconColor = isDark ? "text-purple-400" : "text-purple-600";
  const inputBg = isDark ? "bg-white/5 border-white/10" : "bg-purple-50 border-purple-200";
  const inputFocus = isDark ? "focus:border-purple-400" : "focus:border-purple-500";
  const buttonBg = isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600";
  const toggleActive = isDark ? "bg-purple-500" : "bg-purple-600";
  const toggleInactive = isDark ? "bg-gray-600" : "bg-gray-300";
  const infoBg = isDark ? "bg-white/5" : "bg-purple-50";
  const dangerBg = isDark ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-300";
  const dangerText = isDark ? "text-red-400" : "text-red-600";
  const dangerBtnBg = isDark ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600";
  const avatarBorder = isDark ? "border-purple-500/30" : "border-purple-400";
  const modalBg = isDark ? "bg-slate-900" : "bg-white";
  const modalBorder = isDark ? "border-white/10" : "border-purple-200";
  const cropperControlBg = isDark ? "bg-slate-800/90" : "bg-white/90";

  const Toggle = ({ value, onChange, label, desc }) => (
    <div className={`flex items-center justify-between p-4 ${infoBg} rounded-lg transition-colors`}>
      <div>
        <div className={`${textPrimary} font-medium`}>{label}</div>
        <div className={`${textMuted} text-sm`}>{desc}</div>
      </div>
      <button onClick={() => onChange(!value)} className={`relative w-12 h-6 rounded-full transition-colors ${value ? toggleActive : toggleInactive}`}>
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? "translate-x-6" : ""}`} />
      </button>
    </div>
  );

  if (profileLoading) {
    return (
      <UserPageLayout username="Loading...">
        <div className="flex items-center justify-center py-20">
          <Loader2 className={`w-12 h-12 ${loaderColor} animate-spin`} />
        </div>
      </UserPageLayout>
    );
  }

  return (
    <UserPageLayout username={settings.username || "Loading..."}>
      <div className="space-y-6">
        {message.text && (
          <div className={`p-4 rounded-lg border transition-colors ${message.type === "success" ? (isDark ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-green-50 border-green-300 text-green-700") : (isDark ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-red-50 border-red-300 text-red-700")}`}>
            {message.text}
          </div>
        )}
        {imageError && (
          <div className={`p-4 rounded-lg border transition-colors ${isDark ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-red-50 border-red-300 text-red-700"}`}>{imageError}</div>
        )}

        {/* Profile Picture */}
        <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 transition-colors shadow-lg`}>
          <h2 className={`${textPrimary} text-xl font-bold mb-6 flex items-center gap-2`}>
            <User className={`w-5 h-5 ${iconColor}`} />
            Profile Picture
          </h2>
          <div className="flex flex-col items-center">
            <div className="relative">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className={`w-40 h-40 rounded-full object-cover border-4 ${avatarBorder}`} />
              ) : (
                <div className={`w-40 h-40 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                  <User className={`w-16 h-16 ${textMuted}`} />
                </div>
              )}
              <label className={`absolute -bottom-2 -right-2 cursor-pointer ${buttonBg} rounded-full p-3 transition-colors shadow-lg`}>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <SquarePen size={20} className="text-white" />
              </label>
            </div>
            <p className={`text-center mt-4 ${textMuted} text-sm`}>Click the edit icon to change your profile picture</p>
          </div>
        </div>

        {/* Account Settings */}
        <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 transition-colors shadow-lg`}>
          <h2 className={`${textPrimary} text-xl font-bold mb-6 flex items-center gap-2`}>
            <User className={`w-5 h-5 ${iconColor}`} />
            Account Settings
          </h2>
          <div className="space-y-4">
            {[
              { key: "username", label: "Username", type: "text" },
              { key: "fullName", label: "Full Name", type: "text" },
              { key: "email", label: "Email", type: "email" },
              { key: "phone", label: "Phone", type: "tel" },
              { key: "location", label: "Location", type: "text" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className={`${textSecondary} text-sm font-medium mb-2 block`}>{label}</label>
                <input
                  type={type}
                  value={settings[key] || ""}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  className={`w-full ${inputBg} border rounded-lg px-4 py-3 ${textPrimary} focus:outline-none ${inputFocus} transition-colors`}
                />
              </div>
            ))}
            <div>
              <label className={`${textSecondary} text-sm font-medium mb-2 block`}>Bio</label>
              <textarea
                value={settings.bio || ""}
                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                rows={3}
                className={`w-full ${inputBg} border rounded-lg px-4 py-3 ${textPrimary} focus:outline-none ${inputFocus} resize-none transition-colors`}
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 transition-colors shadow-lg`}>
          <h2 className={`${textPrimary} text-xl font-bold mb-6 flex items-center gap-2`}>
            <Eye className={`w-5 h-5 ${iconColor}`} />
            Privacy Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`${textSecondary} text-sm font-medium mb-2 block`}>Profile Visibility</label>
              <select
                value={settings.profileVisibility || "public"}
                onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                className={`w-full ${inputBg} border rounded-lg px-4 py-3 ${textPrimary} focus:outline-none ${inputFocus} transition-colors`}
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            <Toggle
              value={settings.notifications ?? true}
              onChange={(val) => setSettings({ ...settings, notifications: val })}
              label="Push Notifications"
              desc="Receive notifications about updates"
            />
            <Toggle
              value={settings.emailAlerts ?? true}
              onChange={(val) => setSettings({ ...settings, emailAlerts: val })}
              label="Email Alerts"
              desc="Receive email notifications"
            />
          </div>
        </div>

        {/* Password Change */}
        <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 transition-colors shadow-lg`}>
          <h2 className={`${textPrimary} text-xl font-bold mb-6 flex items-center gap-2`}>
            <Lock className={`w-5 h-5 ${iconColor}`} />
            Change Password
          </h2>
          <div className="space-y-4">
            {["Current Password", "New Password", "Confirm New Password"].map((label) => (
              <div key={label}>
                <label className={`${textSecondary} text-sm font-medium mb-2 block`}>{label}</label>
                <input
                  type="password"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className={`w-full ${inputBg} border rounded-lg px-4 py-3 ${textPrimary} focus:outline-none ${inputFocus} transition-colors`}
                />
              </div>
            ))}
            <button className={`w-full px-6 py-3 ${buttonBg} text-white rounded-lg font-medium transition-colors shadow-lg`}>
              Update Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`${dangerBg} backdrop-blur-xl rounded-2xl border p-6 transition-colors`}>
          <h2 className={`${dangerText} text-xl font-bold mb-4 flex items-center gap-2`}>
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className={`${textSecondary} text-sm mb-4`}>Once you delete your account, there is no going back. Please be certain.</p>
          <button className={`px-6 py-2 ${dangerBtnBg} text-white rounded-lg font-medium transition-colors shadow-lg`}>Delete Account</button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={loading} className={`px-8 py-3 ${buttonBg} disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg`}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className={`relative w-full max-w-md h-96 ${modalBg} rounded-xl shadow-2xl border ${modalBorder}`}>
            <div className="absolute top-3 right-3 z-10">
              <button onClick={handleCropperClose} className={`${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} p-2 rounded-full transition-colors`} disabled={isUploading}>
                <X size={16} />
              </button>
            </div>

            <div className="w-full h-full rounded-xl overflow-hidden">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className={`absolute bottom-3 left-3 right-3 flex items-center justify-between ${cropperControlBg} rounded-lg px-4 py-2`}>
              <div className="flex items-center space-x-2">
                <span className={`${textPrimary} text-sm`}>Zoom:</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-20"
                  disabled={isUploading}
                />
              </div>
              <button onClick={getCroppedImage} disabled={isUploading || !croppedAreaPixels} className={`${buttonBg} disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors flex items-center space-x-1`}>
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {isUploading && <span className="text-xs ml-1">Saving...</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserPageLayout>
  );
}

// Helper functions
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

async function cropImage(imageSrc, crop) {
  const img = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to get canvas context");

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to create blob"))),
      "image/jpeg",
      0.9
    );
  });
}