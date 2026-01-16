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
  const fetchProfileImage = async () => {
    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/users/setting/image`
      );
      const data = await res.json();
      
      if (data.avatar) {
        setProfileImage(data.avatar);
      } else {
        setProfileImage(
          "https://res.cloudinary.com/dc1fkirb4/image/upload/v1756140468/cropped_circle_image_dhaq8x.png"
        );
      }
    } catch (err) {
      console.error("Failed to fetch profile picture:", err);
      setProfileImage(
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1756140468/cropped_circle_image_dhaq8x.png"
      );
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/users/setting`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();

      // Map server response to profile state
      const mappedProfile = {
        username: userData.username || "",
        fullName: userData.settings?.fullname || userData.username || "",
        email: userData.email || "",
        phone: userData.settings?.phone_no || "Not provided",
        location: userData.settings?.location || "Not provided",
        bio: userData.settings?.bio || "No bio yet",
        joinedDate: userData.created_at
          ? new Date(userData.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "Unknown",
        lastLogin: userData.updated_at
          ? new Date(userData.updated_at).toLocaleDateString()
          : "Unknown",
        role: userData.role || "user",
        avatar: userData.settings?.imageUrl || "",
        // Additional settings
        language: "en",
        notifications: userData.settings?.push_notification ?? true,
        emailAlerts: userData.settings?.email_alert ?? true,
        profileVisibility: userData.settings?.visibility || "public",
      };

      setUserProfile(mappedProfile);

      // Fetch profile image if enabled
      if (includeImage) {
        await fetchProfileImage();
      }

      return mappedProfile;
    } catch (err) {
      console.error("Failed to fetch profile:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/users/setting/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: updates.username || userProfile?.username,
            email: updates.email || userProfile?.email,
            settings: {
              fullname: updates.fullName,
              bio: updates.bio,
              phone_no: updates.phone,
              location: updates.location,
              visibility: updates.profileVisibility,
              push_notification: updates.notifications,
              email_alert: updates.emailAlerts,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user settings");
      }

      const updatedData = await response.json();

      // Update local state
      const updatedProfile = {
        username: updatedData.username || userProfile?.username,
        email: updatedData.email || userProfile?.email,
        fullName: updatedData.settings?.fullname || updates.fullName,
        bio: updatedData.settings?.bio || updates.bio,
        phone: updatedData.settings?.phone_no || updates.phone,
        location: updatedData.settings?.location || updates.location,
        language: userProfile?.language || "en",
        notifications:
          updatedData.settings?.push_notification ?? updates.notifications,
        emailAlerts: updatedData.settings?.email_alert ?? updates.emailAlerts,
        profileVisibility:
          updatedData.settings?.visibility || updates.profileVisibility,
        joinedDate: userProfile?.joinedDate,
        lastLogin: new Date().toLocaleDateString(),
        role: userProfile?.role,
        avatar: userProfile?.avatar,
      };

      setUserProfile(updatedProfile);
      return updatedProfile;
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
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/users/setting/image/update`,
        {
          method: "POST",
          body: formData,
        }
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