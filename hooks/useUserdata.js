import { useState, useEffect } from "react";
import useApi from "@/services/authservices";

/**
 * Custom hook for fetching and managing user profile data
 * @param {Object} options - Configuration options
 * @param {boolean} options.fetchOnMount - Whether to fetch data on component mount (default: true)
 * @param {boolean} options.includeImage - Whether to fetch profile image (default: true)
 * @returns {Object} Profile data and loading states
 */
export default function useUserProfile(options = {}) {
  const { fetchOnMount = true, includeImage = true } = options;

  const [userProfile, setUserProfile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiFetch = useApi();

  // Fetch profile image
  const fetchProfileImage = (profilePic) => {
    try {
      if (profilePic) {
        setProfileImage(profilePic);
      } else {
        setProfileImage(
          "https://res.cloudinary.com/dc1fkirb4/image/upload/v1756140468/cropped_circle_image_dhaq8x.png",
        );
      }
    } catch (err) {
      console.error("Failed to fetch profile picture:", err);
      setProfileImage(
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1756140468/cropped_circle_image_dhaq8x.png",
      );
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, settingsRes] = await Promise.all([
        apiFetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/profile`, {
          method: "GET",
        }),
        apiFetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/preferences`, {
          method: "GET",
        }),
      ]);

      if (!profileRes.ok || !settingsRes.ok) {
        throw new Error("Failed to fetch user data");
      }

      // Parse responses
      const profileJson = await profileRes.json();
      const preferencesJson = await settingsRes.json();

      // IMPORTANT: actual user object is inside `data`
      const userData = profileJson.data;
      const preferences = preferencesJson.data;

      if (!userData) {
        throw new Error("Invalid profile response structure");
      }

      if (!preferences) {
        throw new Error("Invalid preferences response structure");
      }

      // Role (slug + name) - Check if admin role exists in roles array
      const hasAdminRole = userData.userRoles?.some(
        (userRole) => userRole.role?.slug === "admin",
      );

      const roleSlug = hasAdminRole
        ? "admin"
        : (userData.userRoles?.[0]?.role?.slug ?? "user");

      const roleName = hasAdminRole
        ? "Admin"
        : (userData.userRoles?.[0]?.role?.name ?? "User");

      // Map server response to profile state
      const mappedProfile = {
        username: userData.fullName?.trim().split(/\s+/)[0] || "",
        userId: userData.id,
        fullName: userData.fullName || userData.username || "",
        email: userData.email || "",
        phone: userData.phoneNumber,
        location: userData.location,
        bio: userData.bio,

        joinedDate: userData.createdAt
          ? new Date(userData.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "Unknown",

        lastLogin: userData.lastLoginAt
          ? new Date(userData.lastLoginAt).toLocaleDateString()
          : "Unknown",

        role: roleName,
        roleSlug,

        avatar: userData.avatarUrl || "",

        // Preferences (from preferences API, not profile)
        theme: preferences.theme,
        language: preferences.language,
        notifications: preferences.pushNotifications,
        emailAlerts: preferences.emailNotifications,
        profileVisibility: preferences.visibility,
      };
      setUserProfile(mappedProfile);

      if (includeImage && mappedProfile.avatar) {
        await fetchProfileImage(mappedProfile.avatar);
      }

      return mappedProfile;
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const normalizeProfile = (profile) => ({
    id: profile.id,
    email: profile.email,
    username: profile.username,
    fullName: profile.fullName,
    phone: profile.phoneNumber,
    bio: profile.bio,
    location: profile.location,
    avatar: profile.avatarUrl,
    role: profile.userRoles?.[0]?.role?.slug,
    isActive: profile.isActive,
    lastLogin: profile.lastLoginAt,
  });

  const normalizeSettings = (settings) => ({
    language: settings.language,
    theme: settings.theme,
    notifications: settings.pushNotifications,
    emailAlerts: settings.emailNotifications,
    profileVisibility: settings.visibility,
  });

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      let profileData = null;
      let settingsData = null;

      const hasProfileChange =
        updates?.username ||
        updates?.fullName ||
        updates?.email ||
        updates?.phone ||
        updates?.location ||
        updates?.bio;

      const hasPreferenceChange =
        updates?.NewTheme ||
        updates?.profileVisibility ||
        updates?.notifications !== undefined ||
        updates?.emailAlerts !== undefined;

      if (hasProfileChange) {
        const res = await apiFetch(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/profile/update`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: updates.username,
              email: updates.email,
              fullName: updates.fullName,
              bio: updates.bio,
              phoneNumber: updates.phone,
              location: updates.location,
            }),
          },
        );

        if (!res.ok) throw new Error("Profile update failed");

        const json = await res.json();
        profileData = normalizeProfile(json.data);
      }

      if (hasPreferenceChange) {
        const res = await apiFetch(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/setting/update`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              theme: updates.NewTheme,
              visibility: updates.profileVisibility,
              pushNotifications: updates.notifications,
              emailNotifications: updates.emailAlerts,
            }),
          },
        );

        if (!res.ok) throw new Error("Preferences update failed");

        const json = await res.json();
        settingsData = normalizeSettings(json.data);
      }

      if (!profileData && !settingsData) {
        console.warn("No changes detected");
        return userProfile;
      }

      const mergedProfile = {
        ...userProfile,
        ...profileData,
        ...settingsData,
      };

      setUserProfile(mergedProfile);
      return mergedProfile;
    } catch (err) {
      console.error("Update failed:", err.message);
      throw err;
    }
  };

  // Update profile image
  const updateProfileImage = async (imageBlob) => {
    try {
      const formData = new FormData();
      formData.append("profilePic", imageBlob, "profile.jpg");

      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/setting/image/update`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (data.imageUrl) {
        setProfileImage(data.imageUrl);

        // Update avatar in profile state
        if (userProfile) {
          setUserProfile({ ...userProfile, avatar: data.imageUrl });
        }
      }

      return data.imageUrl;
    } catch (err) {
      console.error("Error uploading image:", err);
      throw err;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    return await fetchUserProfile();
  };

  // Auto-fetch on mount
  useEffect(() => {
    if (fetchOnMount) {
      fetchUserProfile();
    }
  }, [fetchOnMount]);

  return {
    // State
    userProfile,
    profileImage,
    loading,
    error,

    // Methods
    fetchUserProfile,
    updateUserProfile,
    updateProfileImage,
    refreshProfile,

    // Setters (for manual control)
    setUserProfile,
    setProfileImage,
  };
}
