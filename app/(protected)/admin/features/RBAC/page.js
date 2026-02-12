"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Edit2,
  Trash2,
  Search,
  UserCheck,
  AlertCircle,
  Eye,
  X,
  Calendar,
  Mail,
  MapPin,
  Briefcase,
  Clock,
  Globe,
  Key,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Activity,
  Settings,
  ChevronDown,
  ChevronUp,
  Filter,
  Plus,
  Save,
} from "lucide-react";
import useApi from "@/services/authservices";

export default function RBACManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [theme, setTheme] = useState("light");
  const [showFilters, setShowFilters] = useState(false);
  const [showRolesPanel, setShowRolesPanel] = useState(false);
  const [showRoleAssignModal, setShowRoleAssignModal] = useState(false);
  const [userForRoleManagement, setUserForRoleManagement] = useState(null);
  const [isAssigningRole, setIsAssigningRole] = useState(false);
  const [isRemovingRole, setIsRemovingRole] = useState(null);

  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showCreatePermissionModal, setShowCreatePermissionModal] =
    useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showDeleteRoleConfirm, setShowDeleteRoleConfirm] = useState(null);
  const [showManagePermissionsModal, setShowManagePermissionsModal] =
    useState(false);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState(null);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] =
    useState(null);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isCreatingPermission, setIsCreatingPermission] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [isAssigningPermissions, setIsAssigningPermissions] = useState(false);
  const [newRoleData, setNewRoleData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });
  const [newPermissionData, setNewPermissionData] = useState({
    name: "",
    slug: "",
    description: "",
    resource: "",
    action: "",
  });
  const [editRoleData, setEditRoleData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  const apiFetch = useApi();

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
    fetchUsers();
    fetchRoles();
    fetchPermissions(); // Add this line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/roles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch roles");

      const result = await response.json();

      // Store the roles with their permissions
      if (result.success && result.data) {
        setRoles(result.data);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      // Don't set error state for roles fetch to avoid disrupting the main UI
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      setPermissionsLoading(true);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/permissions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch permissions");

      const result = await response.json();

      // ADD THIS LOG
      console.log("Permissions API Response:", result);

      if (result.success && result.data) {
        setPermissions(result.data);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Create a new role
  const createRole = async () => {
    try {
      setIsCreatingRole(true);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRoleData),
        },
      );

      if (!response.ok) throw new Error("Failed to create role");

      const result = await response.json();
      console.log("Role created successfully:", result);

      // Refresh roles
      await fetchRoles();

      // Reset form and close modal
      setNewRoleData({
        name: "",
        slug: "",
        description: "",
        isActive: true,
      });
      setShowCreateRoleModal(false);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Error creating role:", err);
      return false;
    } finally {
      setIsCreatingRole(false);
    }
  };

  // Create a new permission
  const createPermission = async () => {
    try {
      setIsCreatingPermission(true);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/permissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPermissionData),
        },
      );

      if (!response.ok) throw new Error("Failed to create permission");

      const result = await response.json();
      console.log("Permission created successfully:", result);

      // Refresh roles
      await fetchPermissions();

      // Reset form and close modal
      setNewPermissionData({
        name: "",
        slug: "",
        description: "",
        resource: "",
        action: "",
      });
      setShowCreatePermissionModal(false);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Error creating role:", err);
      return false;
    } finally {
      setIsCreatingPermission(false);
    }
  };

  // Update an existing role
  const updateRole = async () => {
    if (!selectedRoleForEdit) return;

    try {
      setIsUpdatingRole(true);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/roles/${selectedRoleForEdit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editRoleData),
        },
      );

      if (!response.ok) throw new Error("Failed to update role");

      const result = await response.json();
      console.log("Role updated successfully:", result);

      // Refresh roles
      await fetchRoles();

      // Refresh users to update their role info
      await fetchUsers();

      // Close modal
      setShowEditRoleModal(false);
      setSelectedRoleForEdit(null);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Error updating role:", err);
      return false;
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Delete a role
  const deleteRole = async (roleId) => {
    try {
      setIsDeletingRole(true);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/roles/${roleId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete role");

      const result = await response.json();
      console.log("Role deleted successfully:", result);

      // Refresh roles and users
      await fetchRoles();
      await fetchUsers();

      setShowDeleteRoleConfirm(null);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Error deleting role:", err);
      return false;
    } finally {
      setIsDeletingRole(false);
    }
  };

  // Assign permissions to a role
  const assignPermissionsToRole = async () => {
    if (!selectedRoleForPermissions) return;

    try {
      setIsAssigningPermissions(true);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/roles/${selectedRoleForPermissions.id}/permissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ permissionIds: selectedPermissionIds }),
        },
      );

      if (!response.ok) throw new Error("Failed to assign permissions");

      const result = await response.json();
      console.log("Permissions assigned successfully:", result);

      // Refresh roles and users
      await fetchRoles();
      await fetchUsers();

      setShowManagePermissionsModal(false);
      setSelectedRoleForPermissions(null);
      setSelectedPermissionIds([]);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Error assigning permissions:", err);
      return false;
    } finally {
      setIsAssigningPermissions(false);
    }
  };

  // Assign a role to a user
  const assignRoleToUser = async (userId, roleId) => {
    try {
      setIsAssigningRole(true);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/users/${userId}/roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roleId: roleId }),
        },
      );

      if (!response.ok) throw new Error("Failed to assign role to user");

      const result = await response.json();
      console.log("Role assigned successfully:", result);

      // Refresh user data
      await fetchUsers();

      // If the user details modal is open, refresh that user's data
      if (selectedUser && selectedUser._id === userId) {
        await fetchUserInfoById(userId);
      }

      // If role management modal is open, refresh that user's data
      if (userForRoleManagement && userForRoleManagement._id === userId) {
        const updatedUser = users.find((u) => u._id === userId);
        if (updatedUser) {
          setUserForRoleManagement(updatedUser);
        }
      }

      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Error assigning role:", err);
      return false;
    } finally {
      setIsAssigningRole(false);
    }
  };

  // Remove a role from a user
  const removeRoleFromUser = async (userId, roleId) => {
    try {
      setIsRemovingRole(roleId);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/users/${userId}/roles/${roleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to remove role from user");

      const result = await response.json();
      console.log("Role removed successfully:", result);

      // Refresh user data
      await fetchUsers();

      // If the user details modal is open, refresh that user's data
      if (selectedUser && selectedUser._id === userId) {
        await fetchUserInfoById(userId);
      }

      // If role management modal is open, refresh that user's data
      if (userForRoleManagement && userForRoleManagement._id === userId) {
        const updatedUser = users.find((u) => u._id === userId);
        if (updatedUser) {
          setUserForRoleManagement(updatedUser);
        }
      }

      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Error removing role:", err);
      return false;
    } finally {
      setIsRemovingRole(null);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/users/count`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch users");

      const result = await response.json();
      console.log("user whole data", result);

      // Map the API response to match component expectations
      const mappedUsers = result.data.profiles.map((profile) => ({
        _id: profile.id,
        username: profile.username || profile.fullName,
        email: profile.email,
        fullName: profile.fullName,

        // Map all roles as an array
        roles:
          profile.userRoles?.map((userRole) => ({
            id: userRole.role.id,
            slug: userRole.role.slug,
            name: userRole.role.name,
            description: userRole.role.description || "",
            isActive: userRole.role.isActive,
            isSystem: userRole.role.isSystem,
            assignedBy: userRole.assignedBy,
            assignedAt: userRole.assignedAt,
            userRoleId: userRole.id, // Store the user_role junction table ID
            permissions:
              userRole.role.permissions?.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                resource: p.resource,
                action: p.action,
                description: p.description,
              })) || [],
          })) || [],

        // Keep backwards compatibility with single role (primary/first role)
        role: profile.userRoles?.[0]?.role?.slug || "undefined",
        roleName: profile.userRoles?.[0]?.role?.name || "undefined",
        roleDescription: profile.userRoles?.[0]?.role?.description || "",
        permissions:
          profile.userRoles?.[0]?.role?.permissions?.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            resource: p.resource,
            action: p.action,
            description: p.description,
          })) || [],

        // User profile fields
        created_at: profile.createdAt,
        updated_at: profile.updatedAt,
        avatarUrl: profile.avatarUrl,
        isActive: profile.isActive,
        isEmailVerified: profile.isEmailVerified,
        isMfaEnabled: profile.isMfaEnabled,
        lastLoginAt: profile.lastLoginAt,
        lastLoginIp: profile.lastLoginIp,
        phoneNumber: profile.phoneNumber,
        bio: profile.bio,
        company: profile.company,
        position: profile.position,
        location: profile.location,
        timezone: profile.timezone,
        metadata: profile.metadata,

        // Keep original data for reference
        originalData: profile,
      }));

      setUsers(mappedUsers);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfoById = async (userId) => {
    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/users/${userId}`,
      );
      const data = await res.json();

      // Map the detailed user data
      if (data.success && data.data) {
        const profile = data.data;
        const detailedUser = {
          _id: profile.id,
          username: profile.username || profile.fullName,
          email: profile.email,
          fullName: profile.fullName,

          // Map all roles
          roles:
            profile.userRoles?.map((userRole) => ({
              id: userRole.role.id,
              slug: userRole.role.slug,
              name: userRole.role.name,
              description: userRole.role.description || "",
              isActive: userRole.role.isActive,
              isSystem: userRole.role.isSystem,
              assignedBy: userRole.assignedBy,
              assignedAt: userRole.assignedAt,
              userRoleId: userRole.id,
              permissions:
                userRole.role.permissions?.map((p) => ({
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  resource: p.resource,
                  action: p.action,
                  description: p.description,
                })) || [],
            })) || [],

          role: profile.userRoles?.[0]?.role?.slug || "undefined",
          roleName: profile.userRoles?.[0]?.role?.name || "undefined",
          roleDescription: profile.userRoles?.[0]?.role?.description || "",
          permissions:
            profile.userRoles?.[0]?.role?.permissions?.map((p) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              resource: p.resource,
              action: p.action,
              description: p.description,
            })) || [],
          created_at: profile.createdAt,
          updated_at: profile.updatedAt,
          avatarUrl: profile.avatarUrl,
          isActive: profile.isActive,
          isEmailVerified: profile.isEmailVerified,
          isMfaEnabled: profile.isMfaEnabled,
          lastLoginAt: profile.lastLoginAt,
          lastLoginIp: profile.lastLoginIp,
          phoneNumber: profile.phoneNumber,
          bio: profile.bio,
          company: profile.company,
          position: profile.position,
          location: profile.location,
          timezone: profile.timezone,
          metadata: profile.metadata,
          originalData: profile,
        };
        setSelectedUser(detailedUser);
        setShowUserDetails(true);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details");
    }
  };

  const deleteUser = async (userId) => {
    try {
      setIsDeleting(true);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/users/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter((u) => u._id !== userId));
      setShowDeleteConfirm(null);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting user:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setIsTogglingStatus(userId);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/users/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        },
      );

      if (!response.ok) throw new Error("Failed to update user status");

      // Update the user in state with new status
      setUsers(
        users.map((u) =>
          u._id === userId
            ? {
                ...u,
                isActive: !currentStatus,
              }
            : u,
        ),
      );

      // Update selected user if modal is open
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({
          ...selectedUser,
          isActive: !currentStatus,
        });
      }

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error updating user status:", err);
    } finally {
      setIsTogglingStatus(null);
    }
  };

  // Open edit role modal
  const openEditRoleModal = (role) => {
    setSelectedRoleForEdit(role);
    setEditRoleData({
      name: role.name,
      slug: role.slug,
      description: role.description || "",
      isActive: role.isActive,
    });
    setShowEditRoleModal(true);
  };

  // Open manage permissions modal
  const openManagePermissionsModal = (role) => {
    setSelectedRoleForPermissions(role);
    setSelectedPermissionIds(role.permissions?.map((p) => p.id) || []);
    setShowManagePermissionsModal(true);
  };

  // Toggle permission selection
  const togglePermissionSelection = (permissionId) => {
    setSelectedPermissionIds((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  // Helper function to get role details by slug
  const getRoleBySlug = (slug) => {
    return roles.find((role) => role.slug === slug);
  };

  // Helper function to get all permissions for a role
  const getPermissionsForRole = (roleSlug) => {
    const role = getRoleBySlug(roleSlug);
    return role?.permissions || [];
  };

  // Helper function to get all permissions for a user (combining all their roles)
  const getAllUserPermissions = (user) => {
    if (!user.roles || user.roles.length === 0) return [];

    const allPermissions = [];
    const permissionIds = new Set();

    user.roles.forEach((role) => {
      if (role.permissions) {
        role.permissions.forEach((permission) => {
          if (!permissionIds.has(permission.id)) {
            permissionIds.add(permission.id);
            allPermissions.push(permission);
          }
        });
      }
    });

    return allPermissions;
  };

  // Open role assignment modal
  const openRoleAssignmentModal = (user) => {
    console.log("edit role", user);
    setUserForRoleManagement(user);
    setShowRoleAssignModal(true);
  };

  const toggleRowExpansion = (userId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if user has the filtered role in their roles array
    const matchesRole =
      filterRole === "all" || user.roles?.some((r) => r.slug === filterRole);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "instructor":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "student":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "moderator":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "instructor":
        return <Edit2 className="w-4 h-4" />;
      case "student":
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getPermissionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case "read":
        return <Eye className="w-3 h-3" />;
      case "create":
        return <Settings className="w-3 h-3" />;
      case "update":
        return <Edit2 className="w-3 h-3" />;
      case "delete":
        return <Trash2 className="w-3 h-3" />;
      case "manage":
        return <Shield className="w-3 h-3" />;
      default:
        return <Key className="w-3 h-3" />;
    }
  };

  // Calculate role stats based on users' roles array
  const roleStats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    verified: users.filter((u) => u.isEmailVerified).length,
    mfaEnabled: users.filter((u) => u.isMfaEnabled).length,
    // Dynamically calculate role counts from users' roles arrays
    byRole: roles.reduce((acc, role) => {
      acc[role.slug] = users.filter((u) =>
        u.roles?.some((r) => r.slug === role.slug),
      ).length;
      return acc;
    }, {}),
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-slate-950 via-indigo-950 to-slate-950"
    : "from-indigo-50 via-purple-50 to-pink-50";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const textMuted = isDark ? "text-gray-300" : "text-gray-700";
  const cardBg = isDark
    ? "bg-slate-800/50 border-slate-700/50"
    : "bg-white border-indigo-200";
  const inputBg = isDark
    ? "bg-slate-900/50 border-slate-700"
    : "bg-white border-indigo-200";
  const inputFocus = isDark
    ? "focus:border-indigo-500"
    : "focus:border-indigo-400";
  const buttonPrimary = isDark
    ? "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800"
    : "bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300";
  const tableBorder = isDark ? "border-slate-700" : "border-indigo-100";
  const tableHover = isDark ? "hover:bg-slate-700/30" : "hover:bg-indigo-50";
  const modalBg = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-indigo-200";
  const modalOverlay = isDark ? "bg-black/50" : "bg-black/30";
  const errorBg = isDark
    ? "bg-red-500/10 border-red-500/30 text-red-400"
    : "bg-red-50 border-red-300 text-red-700";
  const successBg = isDark
    ? "bg-green-500/10 border-green-500/30 text-green-400"
    : "bg-green-50 border-green-300 text-green-700";
  const cancelButton = isDark
    ? "bg-slate-700 hover:bg-slate-600"
    : "bg-gray-200 hover:bg-gray-300";
  const deleteButton = isDark
    ? "bg-red-600 hover:bg-red-700"
    : "bg-red-500 hover:bg-red-600";

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${bgGradient} p-8 transition-colors duration-300`}
      >
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} p-8 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className={`text-4xl font-bold ${textPrimary} flex items-center gap-3`}
            >
              <Shield className="w-10 h-10 text-indigo-500" />
              User Management & RBAC
            </h1>
            <p className={`${textSecondary} mt-2 text-lg`}>
              Comprehensive role-based access control and user administration
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRolesPanel(true)}
              disabled={rolesLoading}
              className={`px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              <Shield className="w-5 h-5" />
              View Roles ({roles.length})
            </button>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className={`px-6 py-3 ${buttonPrimary} disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              <svg
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className={`mb-6 p-4 ${errorBg} border rounded-xl flex items-center gap-3 animate-in slide-in-from-top`}
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className={`ml-auto ${isDark ? "text-red-400 hover:text-red-300" : "text-red-700 hover:text-red-600"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            className={`${cardBg} backdrop-blur-sm border rounded-xl p-6 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>
                  Total Users
                </p>
                <p className={`text-3xl font-bold ${textPrimary} mt-1`}>
                  {roleStats.total}
                </p>
              </div>
              <Users className="w-12 h-12 text-indigo-500 opacity-80" />
            </div>
          </div>

          {/* Dynamic Role Stats Cards */}
          {roles.slice(0, 2).map((role, index) => {
            const colors = [
              {
                border: "border-purple-500/30",
                text: "text-purple-500",
                icon: "text-purple-500",
              },
              {
                border: "border-blue-500/30",
                text: "text-blue-500",
                icon: "text-blue-500",
              },
            ];
            const color = colors[index] || colors[0];

            return (
              <div
                key={role.id}
                className={`${cardBg} backdrop-blur-sm border ${color.border} rounded-xl p-6 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${textSecondary} text-sm font-medium`}>
                      {role.name}s
                    </p>
                    <p className={`text-3xl font-bold ${color.text} mt-1`}>
                      {roleStats.byRole[role.slug] || 0}
                    </p>
                  </div>
                  <Shield className={`w-12 h-12 ${color.icon} opacity-80`} />
                </div>
              </div>
            );
          })}

          <div
            className={`${cardBg} backdrop-blur-sm border border-green-500/30 rounded-xl p-6 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>
                  Active Users
                </p>
                <p className="text-3xl font-bold text-green-500 mt-1">
                  {roleStats.active}
                </p>
              </div>
              <Activity className="w-12 h-12 text-green-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div
          className={`${cardBg} backdrop-blur-sm border rounded-xl p-6 mb-6 transition-colors shadow-lg`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`}
                />
                <input
                  type="text"
                  placeholder="Search by username, email, or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 ${inputBg} border rounded-lg ${textPrimary} placeholder-gray-400 focus:outline-none ${inputFocus} transition-all`}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 ${inputBg} border rounded-lg ${textPrimary} hover:border-indigo-500 transition-all flex items-center gap-2`}
              >
                <Filter className="w-5 h-5" />
                Filters
                {showFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-opacity-20">
                <div>
                  <label
                    className={`block ${textSecondary} text-sm font-medium mb-2`}
                  >
                    Filter by Role
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus} transition-colors cursor-pointer`}
                  >
                    <option value="all">All Roles</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.slug}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className={`block ${textSecondary} text-sm font-medium mb-2`}
                  >
                    Filter by Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus} transition-colors cursor-pointer`}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <span className={textSecondary}>
                Showing {filteredUsers.length} of {users.length} users
              </span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div
          className={`${cardBg} backdrop-blur-sm border rounded-xl overflow-hidden transition-colors shadow-lg`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${tableBorder} bg-opacity-50`}>
                  <th
                    className={`text-left p-4 ${textSecondary} font-semibold`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      User
                    </div>
                  </th>
                  <th
                    className={`text-left p-4 ${textSecondary} font-semibold`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Roles
                    </div>
                  </th>
                  <th
                    className={`text-left p-4 ${textSecondary} font-semibold`}
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Status
                    </div>
                  </th>
                  <th
                    className={`text-left p-4 ${textSecondary} font-semibold`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Last Login
                    </div>
                  </th>
                  <th
                    className={`text-center p-4 ${textSecondary} font-semibold`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <React.Fragment key={user._id}>
                    <tr
                      className={`border-b ${tableBorder} ${tableHover} transition-all cursor-pointer`}
                      onClick={() => toggleRowExpansion(user._id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.username}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {user.username?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div>
                            <div className={`${textPrimary} font-semibold`}>
                              {user.fullName || user.username || "N/A"}
                            </div>
                            <div className={`${textSecondary} text-sm`}>
                              {user.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <span
                                key={role.id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getRoleBadgeColor(
                                  role.slug,
                                )}`}
                              >
                                {getRoleIcon(role.slug)}
                                {role.name}
                              </span>
                            ))
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getRoleBadgeColor(
                                "undefined",
                              )}`}
                            >
                              No roles
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {user.isActive ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span
                              className={`text-sm ${user.isActive ? "text-green-500" : "text-red-500"}`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {user.isEmailVerified ? (
                              <Mail className="w-3 h-3 text-blue-500" />
                            ) : (
                              <Mail className="w-3 h-3 text-gray-400" />
                            )}
                            <span className={`text-xs ${textSecondary}`}>
                              {user.isEmailVerified ? "Verified" : "Unverified"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={`p-4 ${textSecondary} text-sm`}>
                        {user.lastLoginAt ? (
                          <div>
                            <div>
                              {new Date(user.lastLoginAt).toLocaleString()}
                            </div>
                            {user.lastLoginIp && (
                              <div className="text-xs opacity-70">
                                IP: {user.lastLoginIp}
                              </div>
                            )}
                          </div>
                        ) : (
                          "Never"
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleUserStatus(user._id, user.isActive);
                            }}
                            disabled={isTogglingStatus === user._id}
                            className={`p-2 ${
                              user.isActive
                                ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"
                                : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                            } disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all transform hover:scale-110`}
                            title={
                              user.isActive
                                ? "Deactivate User"
                                : "Activate User"
                            }
                          >
                            {isTogglingStatus === user._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                            ) : user.isActive ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openRoleAssignmentModal(user);
                            }}
                            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all transform hover:scale-110"
                            title="Manage Roles"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchUserInfoById(user._id);
                            }}
                            className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg transition-all transform hover:scale-110"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(user._id);
                            }}
                            disabled={isDeleting}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-400 rounded-lg transition-all transform hover:scale-110"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row Content */}
                    {expandedRows.has(user._id) && (
                      <tr className={`border-b ${tableBorder}`}>
                        <td colSpan="5" className="p-0">
                          <div
                            className={`p-6 ${isDark ? "bg-slate-900/50" : "bg-indigo-50/50"}`}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {/* Personal Information */}
                              <div>
                                <h4
                                  className={`${textPrimary} font-semibold mb-3 flex items-center gap-2`}
                                >
                                  <Users className="w-4 h-4 text-indigo-500" />
                                  Personal Information
                                </h4>
                                <div className="space-y-2">
                                  {user.phoneNumber && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className={textSecondary}>
                                        Phone:
                                      </span>
                                      <span className={textMuted}>
                                        {user.phoneNumber}
                                      </span>
                                    </div>
                                  )}
                                  {user.location && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <MapPin className="w-3 h-3" />
                                      <span className={textMuted}>
                                        {user.location}
                                      </span>
                                    </div>
                                  )}
                                  {user.timezone && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Globe className="w-3 h-3" />
                                      <span className={textMuted}>
                                        {user.timezone}
                                      </span>
                                    </div>
                                  )}
                                  {user.bio && (
                                    <div className="text-sm">
                                      <span
                                        className={`${textSecondary} block mb-1`}
                                      >
                                        Bio:
                                      </span>
                                      <span className={textMuted}>
                                        {user.bio}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Professional Information */}
                              {(user.company || user.position) && (
                                <div>
                                  <h4
                                    className={`${textPrimary} font-semibold mb-3 flex items-center gap-2`}
                                  >
                                    <Briefcase className="w-4 h-4 text-indigo-500" />
                                    Professional
                                  </h4>
                                  <div className="space-y-2">
                                    {user.company && (
                                      <div className="text-sm">
                                        <span className={textSecondary}>
                                          Company:
                                        </span>
                                        <span className={`${textMuted} ml-2`}>
                                          {user.company}
                                        </span>
                                      </div>
                                    )}
                                    {user.position && (
                                      <div className="text-sm">
                                        <span className={textSecondary}>
                                          Position:
                                        </span>
                                        <span className={`${textMuted} ml-2`}>
                                          {user.position}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Security & Account */}
                              <div>
                                <h4
                                  className={`${textPrimary} font-semibold mb-3 flex items-center gap-2`}
                                >
                                  <Lock className="w-4 h-4 text-indigo-500" />
                                  Security & Account
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    {user.isMfaEnabled ? (
                                      <>
                                        <Lock className="w-3 h-3 text-green-500" />
                                        <span className="text-green-500">
                                          MFA Enabled
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <Unlock className="w-3 h-3 text-yellow-500" />
                                        <span className="text-yellow-500">
                                          MFA Disabled
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="text-sm">
                                    <span className={textSecondary}>
                                      Created:
                                    </span>
                                    <span className={`${textMuted} ml-2`}>
                                      {new Date(
                                        user.created_at,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="text-sm">
                                    <span className={textSecondary}>
                                      Updated:
                                    </span>
                                    <span className={`${textMuted} ml-2`}>
                                      {new Date(
                                        user.updated_at,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* All Roles */}
                              {user.roles && user.roles.length > 0 && (
                                <div className="md:col-span-2 lg:col-span-3">
                                  <h4
                                    className={`${textPrimary} font-semibold mb-3 flex items-center gap-2`}
                                  >
                                    <Shield className="w-4 h-4 text-indigo-500" />
                                    All Assigned Roles ({user.roles.length})
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {user.roles.map((role) => (
                                      <div
                                        key={role.id}
                                        className={`p-3 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-indigo-200"} rounded-lg`}
                                      >
                                        <div className="flex items-center gap-2 mb-2">
                                          <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(
                                              role.slug,
                                            )}`}
                                          >
                                            {getRoleIcon(role.slug)}
                                            {role.name}
                                          </span>
                                          {role.isSystem && (
                                            <span
                                              className={`px-2 py-0.5 rounded text-xs ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                                            >
                                              System
                                            </span>
                                          )}
                                        </div>
                                        {role.description && (
                                          <p
                                            className={`${textSecondary} text-xs mb-2`}
                                          >
                                            {role.description}
                                          </p>
                                        )}
                                        <div
                                          className={`${textSecondary} text-xs`}
                                        >
                                          {role.permissions?.length || 0}{" "}
                                          permission
                                          {(role.permissions?.length || 0) !== 1
                                            ? "s"
                                            : ""}
                                          {role.assignedAt && (
                                            <>
                                              {" • Assigned "}
                                              {new Date(
                                                role.assignedAt,
                                              ).toLocaleDateString()}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Combined Permissions */}
                              {(() => {
                                const allPermissions =
                                  getAllUserPermissions(user);
                                return allPermissions.length > 0 ? (
                                  <div className="md:col-span-2 lg:col-span-3">
                                    <h4
                                      className={`${textPrimary} font-semibold mb-3 flex items-center gap-2`}
                                    >
                                      <Key className="w-4 h-4 text-indigo-500" />
                                      Combined Permissions (
                                      {allPermissions.length})
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                      {allPermissions.map((permission) => (
                                        <div
                                          key={permission.id}
                                          className={`flex items-center gap-2 px-3 py-2 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-indigo-200"} rounded-lg text-sm`}
                                        >
                                          {getPermissionIcon(permission.action)}
                                          <div className="flex flex-col">
                                            <span
                                              className={`${textPrimary} text-xs font-medium`}
                                            >
                                              {permission.name}
                                            </span>
                                            <span
                                              className={`${textSecondary} text-xs`}
                                            >
                                              {permission.resource}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className={`text-center py-16 ${textSecondary}`}>
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}
            onClick={() => setShowUserDetails(false)}
          >
            <div
              className={`${modalBg} border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-inherit border-b border-opacity-20 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {selectedUser.avatarUrl ? (
                    <img
                      src={selectedUser.avatarUrl}
                      alt={selectedUser.username}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/20"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {selectedUser.username?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <h2 className={`text-2xl font-bold ${textPrimary}`}>
                      {selectedUser.fullName || selectedUser.username}
                    </h2>
                    <p className={textSecondary}>{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openRoleAssignmentModal(selectedUser);
                    }}
                    className={`px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all flex items-center gap-2 font-medium`}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Manage Roles</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleUserStatus(selectedUser._id, selectedUser.isActive);
                    }}
                    disabled={isTogglingStatus === selectedUser._id}
                    className={`px-4 py-2 ${
                      selectedUser.isActive
                        ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"
                        : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                    } disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all flex items-center gap-2 font-medium`}
                  >
                    {isTogglingStatus === selectedUser._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                        <span className="text-sm">Processing...</span>
                      </>
                    ) : selectedUser.isActive ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">Deactivate</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Activate</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className={`p-2 hover:bg-opacity-10 rounded-lg transition-colors`}
                  >
                    <X className={`w-6 h-6 ${textSecondary}`} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* All Roles Section */}
                {selectedUser.roles && selectedUser.roles.length > 0 && (
                  <div
                    className={`${isDark ? "bg-slate-900/50" : "bg-indigo-50/50"} rounded-xl p-4`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-indigo-500" />
                      <h3 className={`${textPrimary} font-semibold`}>
                        Assigned Roles ({selectedUser.roles.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedUser.roles.map((role) => (
                        <div
                          key={role.id}
                          className={`p-4 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-indigo-200"} rounded-lg`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getRoleBadgeColor(
                                role.slug,
                              )}`}
                            >
                              {getRoleIcon(role.slug)}
                              {role.name}
                            </span>
                            {role.isSystem && (
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                              >
                                System
                              </span>
                            )}
                          </div>
                          {role.description && (
                            <p className={`${textSecondary} text-sm mb-2`}>
                              {role.description}
                            </p>
                          )}
                          <div className={`${textSecondary} text-xs`}>
                            {role.permissions?.length || 0} permission
                            {(role.permissions?.length || 0) !== 1 ? "s" : ""}
                            {role.assignedAt && (
                              <>
                                {" • Assigned "}
                                {new Date(role.assignedAt).toLocaleDateString()}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div
                  className={`${isDark ? "bg-slate-900/50" : "bg-indigo-50/50"} rounded-xl p-4`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <h3 className={`${textPrimary} font-semibold`}>Status</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {selectedUser.isActive ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span
                        className={`font-medium ${selectedUser.isActive ? "text-green-500" : "text-red-500"}`}
                      >
                        {selectedUser.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span className={`text-sm ${textMuted}`}>
                        Email{" "}
                        {selectedUser.isEmailVerified
                          ? "Verified"
                          : "Unverified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedUser.isMfaEnabled ? (
                        <Lock className="w-4 h-4 text-green-500" />
                      ) : (
                        <Unlock className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className={`text-sm ${textMuted}`}>
                        MFA {selectedUser.isMfaEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div
                  className={`${isDark ? "bg-slate-900/50" : "bg-indigo-50/50"} rounded-xl p-4`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <h3 className={`${textPrimary} font-semibold`}>
                      Account Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className={`${textSecondary} text-sm`}>
                        Created At:
                      </span>
                      <p className={`${textMuted} font-medium`}>
                        {new Date(selectedUser.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className={`${textSecondary} text-sm`}>
                        Updated At:
                      </span>
                      <p className={`${textMuted} font-medium`}>
                        {new Date(selectedUser.updated_at).toLocaleString()}
                      </p>
                    </div>
                    {selectedUser.lastLoginAt && (
                      <>
                        <div>
                          <span className={`${textSecondary} text-sm`}>
                            Last Login:
                          </span>
                          <p className={`${textMuted} font-medium`}>
                            {new Date(
                              selectedUser.lastLoginAt,
                            ).toLocaleString()}
                          </p>
                        </div>
                        {selectedUser.lastLoginIp && (
                          <div>
                            <span className={`${textSecondary} text-sm`}>
                              Last Login IP:
                            </span>
                            <p className={`${textMuted} font-medium`}>
                              {selectedUser.lastLoginIp}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Personal & Professional Info */}
                {(selectedUser.phoneNumber ||
                  selectedUser.location ||
                  selectedUser.timezone ||
                  selectedUser.company ||
                  selectedUser.position ||
                  selectedUser.bio) && (
                  <div
                    className={`${isDark ? "bg-slate-900/50" : "bg-indigo-50/50"} rounded-xl p-4`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-indigo-500" />
                      <h3 className={`${textPrimary} font-semibold`}>
                        Personal & Professional Details
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.phoneNumber && (
                        <div>
                          <span className={`${textSecondary} text-sm`}>
                            Phone:
                          </span>
                          <p className={`${textMuted} font-medium`}>
                            {selectedUser.phoneNumber}
                          </p>
                        </div>
                      )}
                      {selectedUser.location && (
                        <div>
                          <span className={`${textSecondary} text-sm`}>
                            Location:
                          </span>
                          <p
                            className={`${textMuted} font-medium flex items-center gap-1`}
                          >
                            <MapPin className="w-4 h-4" />
                            {selectedUser.location}
                          </p>
                        </div>
                      )}
                      {selectedUser.timezone && (
                        <div>
                          <span className={`${textSecondary} text-sm`}>
                            Timezone:
                          </span>
                          <p
                            className={`${textMuted} font-medium flex items-center gap-1`}
                          >
                            <Globe className="w-4 h-4" />
                            {selectedUser.timezone}
                          </p>
                        </div>
                      )}
                      {selectedUser.company && (
                        <div>
                          <span className={`${textSecondary} text-sm`}>
                            Company:
                          </span>
                          <p className={`${textMuted} font-medium`}>
                            {selectedUser.company}
                          </p>
                        </div>
                      )}
                      {selectedUser.position && (
                        <div>
                          <span className={`${textSecondary} text-sm`}>
                            Position:
                          </span>
                          <p
                            className={`${textMuted} font-medium flex items-center gap-1`}
                          >
                            <Briefcase className="w-4 h-4" />
                            {selectedUser.position}
                          </p>
                        </div>
                      )}
                      {selectedUser.bio && (
                        <div className="md:col-span-2">
                          <span className={`${textSecondary} text-sm`}>
                            Bio:
                          </span>
                          <p className={`${textMuted} font-medium mt-1`}>
                            {selectedUser.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Combined Permissions */}
                {(() => {
                  const allPermissions = getAllUserPermissions(selectedUser);
                  return allPermissions.length > 0 ? (
                    <div
                      className={`${isDark ? "bg-slate-900/50" : "bg-indigo-50/50"} rounded-xl p-4`}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Key className="w-5 h-5 text-indigo-500" />
                        <h3 className={`${textPrimary} font-semibold`}>
                          Combined Permissions ({allPermissions.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {allPermissions.map((permission) => (
                          <div
                            key={permission.id}
                            className={`flex items-start gap-3 p-3 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-indigo-200"} rounded-lg`}
                          >
                            <div className="mt-0.5">
                              {getPermissionIcon(permission.action)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className={`${textPrimary} text-sm font-semibold`}
                              >
                                {permission.name}
                              </div>
                              <div
                                className={`${textSecondary} text-xs mt-0.5`}
                              >
                                {permission.slug}
                              </div>
                              {permission.description && (
                                <div
                                  className={`${textSecondary} text-xs mt-1`}
                                >
                                  {permission.description}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Metadata */}
                {selectedUser.metadata && (
                  <div
                    className={`${isDark ? "bg-slate-900/50" : "bg-indigo-50/50"} rounded-xl p-4`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Settings className="w-5 h-5 text-indigo-500" />
                      <h3 className={`${textPrimary} font-semibold`}>
                        Metadata
                      </h3>
                    </div>
                    <pre
                      className={`${textMuted} text-sm overflow-x-auto p-3 ${isDark ? "bg-slate-800" : "bg-white"} rounded-lg`}
                    >
                      {JSON.stringify(selectedUser.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Roles Panel Modal */}
        {showRolesPanel && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}
            onClick={() => setShowRolesPanel(false)}
          >
            <div
              className={`${modalBg} border rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel Header */}
              <div className="sticky top-0 bg-inherit border-b border-opacity-20 p-6 flex items-center justify-between">
                <div>
                  <h2
                    className={`text-2xl font-bold ${textPrimary} flex items-center gap-2`}
                  >
                    <Shield className="w-8 h-8 text-purple-500" />
                    All Roles & Permissions
                  </h2>
                  <p className={`${textSecondary} mt-1`}>
                    {roles.length} role{roles.length !== 1 ? "s" : ""}{" "}
                    configured in the system
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateRoleModal(true)}
                    className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center gap-2 font-medium`}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Create Role</span>
                  </button>
                  <button
                    onClick={() => setShowCreatePermissionModal(true)}
                    className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 font-medium`}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Create Permission</span>
                  </button>
                  <button
                    onClick={() => setShowRolesPanel(false)}
                    className={`p-2 hover:bg-opacity-10 rounded-lg transition-colors`}
                  >
                    <X className={`w-6 h-6 ${textSecondary}`} />
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="p-6 space-y-6">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`${isDark ? "bg-slate-900/50" : "bg-indigo-50/50"} rounded-xl p-6 border ${isDark ? "border-slate-700" : "border-indigo-200"}`}
                  >
                    {/* Role Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-2xl font-bold ${textPrimary}`}>
                            {role.name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                              role.slug,
                            )}`}
                          >
                            {getRoleIcon(role.slug)}
                            {role.slug}
                          </span>
                          {role.isSystem && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                            >
                              System Role
                            </span>
                          )}
                          {role.isActive ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        {role.description && (
                          <p className={`${textSecondary} text-sm`}>
                            {role.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`${textSecondary} text-sm`}>
                          {roleStats.byRole[role.slug] || 0} user
                          {(roleStats.byRole[role.slug] || 0) !== 1 ? "s" : ""}
                        </div>
                        <div className={`${textSecondary} text-xs mt-1`}>
                          {role.permissions.length} permission
                          {role.permissions.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    {/* Role Metadata */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className={`${textSecondary}`}>Created:</span>
                        <span className={`${textMuted} ml-2`}>
                          {new Date(role.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className={`${textSecondary}`}>Updated:</span>
                        <span className={`${textMuted} ml-2`}>
                          {new Date(role.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Role Actions */}
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openManagePermissionsModal(role);
                        }}
                        className={`px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg transition-all flex items-center gap-2 font-medium text-sm`}
                      >
                        <Key className="w-4 h-4" />
                        Manage Permissions
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditRoleModal(role);
                        }}
                        className={`px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all flex items-center gap-2 font-medium text-sm`}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Role
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteRoleConfirm(role.id);
                        }}
                        className={`px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all flex items-center gap-2 font-medium text-sm`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>

                    {/* Permissions */}
                    {role.permissions.length > 0 ? (
                      <div>
                        <h4
                          className={`${textPrimary} font-semibold mb-3 flex items-center gap-2`}
                        >
                          <Key className="w-4 h-4 text-indigo-500" />
                          Permissions
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {role.permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className={`flex items-start gap-3 p-3 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-indigo-200"} rounded-lg`}
                            >
                              <div className="mt-0.5">
                                {getPermissionIcon(permission.action)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div
                                  className={`${textPrimary} text-sm font-semibold`}
                                >
                                  {permission.name}
                                </div>
                                <div
                                  className={`${textSecondary} text-xs mt-0.5`}
                                >
                                  {permission.slug}
                                </div>
                                <div
                                  className={`${textSecondary} text-xs mt-1 flex items-center gap-1`}
                                >
                                  <span className="capitalize">
                                    {permission.action}
                                  </span>
                                  <span>•</span>
                                  <span className="capitalize">
                                    {permission.resource}
                                  </span>
                                </div>
                                {permission.description && (
                                  <div
                                    className={`${textSecondary} text-xs mt-1 italic`}
                                  >
                                    {permission.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className={`text-center py-8 ${textSecondary}`}>
                        <Key className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No permissions assigned to this role</p>
                      </div>
                    )}
                  </div>
                ))}

                {roles.length === 0 && (
                  <div className={`text-center py-16 ${textSecondary}`}>
                    <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No roles found</p>
                    <p className="text-sm mt-2">
                      No roles have been configured in the system yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create Role Modal */}
        {showCreateRoleModal && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}
            onClick={() => setShowCreateRoleModal(false)}
          >
            <div
              className={`${modalBg} border rounded-2xl max-w-md w-full shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-inherit border-b border-opacity-20 p-6 flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${textPrimary} flex items-center gap-2`}
                >
                  <Plus className="w-6 h-6 text-green-500" />
                  Create New Role
                </h2>
                <button
                  onClick={() => setShowCreateRoleModal(false)}
                  className={`p-2 hover:bg-opacity-10 rounded-lg transition-colors`}
                >
                  <X className={`w-6 h-6 ${textSecondary}`} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label
                    className={`block ${textSecondary} text-sm font-medium mb-2`}
                  >
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={newRoleData.name}
                    onChange={(e) =>
                      setNewRoleData({ ...newRoleData, name: e.target.value })
                    }
                    placeholder="e.g., Moderator"
                    className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus}`}
                  />
                </div>
                <div>
                  <label
                    className={`block ${textSecondary} text-sm font-medium mb-2`}
                  >
                    Role Slug *
                  </label>
                  <input
                    type="text"
                    value={newRoleData.slug}
                    onChange={(e) =>
                      setNewRoleData({
                        ...newRoleData,
                        slug: e.target.value.toLowerCase(),
                      })
                    }
                    placeholder="e.g., moderator"
                    className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus}`}
                  />
                </div>
                <div>
                  <label
                    className={`block ${textSecondary} text-sm font-medium mb-2`}
                  >
                    Description
                  </label>
                  <textarea
                    value={newRoleData.description}
                    onChange={(e) =>
                      setNewRoleData({
                        ...newRoleData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the role..."
                    rows={3}
                    className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus}`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newRoleData.isActive}
                    onChange={(e) =>
                      setNewRoleData({
                        ...newRoleData,
                        isActive: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className={`${textMuted} text-sm`}>
                    Active
                  </label>
                </div>
              </div>
              <div className="border-t border-opacity-20 p-6 flex gap-3">
                <button
                  onClick={() => setShowCreateRoleModal(false)}
                  disabled={isCreatingRole}
                  className={`flex-1 px-6 py-3 ${cancelButton} disabled:opacity-50 ${textPrimary} rounded-xl transition-all font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={createRole}
                  disabled={
                    isCreatingRole || !newRoleData.name || !newRoleData.slug
                  }
                  className={`flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2`}
                >
                  {isCreatingRole ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Role
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create permision Modal */}
        {showCreatePermissionModal && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}
            onClick={() => setShowCreatePermissionModal(false)}
          >
            <div
              className={`${modalBg} border rounded-2xl max-w-md w-full shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-inherit border-b border-opacity-20 p-6 flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${textPrimary} flex items-center gap-2`}
                >
                  <Plus className="w-6 h-6 text-green-500" />
                  Create New Permission
                </h2>
                <button
                  onClick={() => setShowCreatePermissionModal(false)}
                  className={`p-2 hover:bg-opacity-10 rounded-lg transition-colors`}
                >
                  <X className={`w-6 h-6 ${textSecondary}`} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      className={`block ${textSecondary} text-sm font-medium mb-2`}
                    >
                      Permission Name *
                    </label>
                    <input
                      type="text"
                      value={newPermissionData.name}
                      onChange={(e) =>
                        setNewPermissionData({
                          ...newPermissionData,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g., Read Access"
                      className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block ${textSecondary} text-sm font-medium mb-2`}
                    >
                      Permission Slug *
                    </label>
                    <input
                      type="text"
                      value={newPermissionData.slug}
                      onChange={(e) =>
                        setNewPermissionData({
                          ...newPermissionData,
                          slug: e.target.value.toLowerCase(),
                        })
                      }
                      placeholder="e.g., users.read"
                      className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      className={`block ${textSecondary} text-sm font-medium mb-2`}
                    >
                      Permission Resource *
                    </label>
                    <input
                      type="text"
                      value={newPermissionData.resource}
                      onChange={(e) =>
                        setNewPermissionData({
                          ...newPermissionData,
                          resource: e.target.value,
                        })
                      }
                      placeholder="e.g., Contact Response"
                      className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block ${textSecondary} text-sm font-medium mb-2`}
                    >
                      Permission Action *
                    </label>
                    <input
                      type="text"
                      value={newPermissionData.action}
                      onChange={(e) =>
                        setNewPermissionData({
                          ...newPermissionData,
                          action: e.target.value,
                        })
                      }
                      placeholder="e.g., Read"
                      className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus}`}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={`block ${textSecondary} text-sm font-medium mb-2`}
                  >
                    Description
                  </label>
                  <textarea
                    value={newPermissionData.description}
                    onChange={(e) =>
                      setNewPermissionData({
                        ...newPermissionData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the permission..."
                    rows={3}
                    className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus}`}
                  />
                </div>
              </div>
              <div className="border-t border-opacity-20 p-6 flex gap-3">
                <button
                  onClick={() => setShowCreatePermissionModal(false)}
                  disabled={isCreatingPermission}
                  className={`flex-1 px-6 py-3 ${cancelButton} disabled:opacity-50 ${textPrimary} rounded-xl transition-all font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={createPermission}
                  disabled={
                    isCreatingPermission ||
                    !newPermissionData.name ||
                    !newPermissionData.slug
                  }
                  className={`flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2`}
                >
                  {isCreatingPermission ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Permission
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {showEditRoleModal && selectedRoleForEdit && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}
            onClick={() => setShowEditRoleModal(false)}
          >
            <div
              className={`${modalBg} border rounded-2xl max-w-md w-full shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-inherit border-b border-opacity-20 p-6 flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${textPrimary} flex items-center gap-2`}
                >
                  <Edit2 className="w-6 h-6 text-blue-500" />
                  Edit Role
                </h2>
                <button
                  onClick={() => setShowEditRoleModal(false)}
                  className={`p-2 hover:bg-opacity-10 rounded-lg transition-colors`}
                >
                  <X className={`w-6 h-6 ${textSecondary}`} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label
                    className={`block ${textSecondary} text-sm font-medium mb-2`}
                  >
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={editRoleData.name}
                    onChange={(e) =>
                      setEditRoleData({ ...editRoleData, name: e.target.value })
                    }
                    className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus}`}
                  />
                </div>
                <div>
                  <label
                    className={`block ${textSecondary} text-sm font-medium mb-2`}
                  >
                    Role Slug *
                  </label>
                  <input
                    type="text"
                    value={editRoleData.slug}
                    onChange={(e) =>
                      setEditRoleData({
                        ...editRoleData,
                        slug: e.target.value.toLowerCase(),
                      })
                    }
                    className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus}`}
                  />
                </div>
                <div>
                  <label
                    className={`block ${textSecondary} text-sm font-medium mb-2`}
                  >
                    Description
                  </label>
                  <textarea
                    value={editRoleData.description}
                    onChange={(e) =>
                      setEditRoleData({
                        ...editRoleData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className={`w-full px-4 py-2 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus}`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    checked={editRoleData.isActive}
                    onChange={(e) =>
                      setEditRoleData({
                        ...editRoleData,
                        isActive: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="editIsActive"
                    className={`${textMuted} text-sm`}
                  >
                    Active
                  </label>
                </div>
              </div>
              <div className="border-t border-opacity-20 p-6 flex gap-3">
                <button
                  onClick={() => setShowEditRoleModal(false)}
                  disabled={isUpdatingRole}
                  className={`flex-1 px-6 py-3 ${cancelButton} disabled:opacity-50 ${textPrimary} rounded-xl transition-all font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={updateRole}
                  disabled={
                    isUpdatingRole || !editRoleData.name || !editRoleData.slug
                  }
                  className={`flex-1 px-6 py-3 ${buttonPrimary} disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2`}
                >
                  {isUpdatingRole ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Role
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Role Confirmation Modal */}
        {showDeleteRoleConfirm && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center z-50`}
          >
            <div
              className={`${modalBg} border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl`}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3
                className={`text-2xl font-bold ${textPrimary} mb-3 text-center`}
              >
                Delete Role
              </h3>
              <p className={`${textSecondary} mb-6 text-center`}>
                Are you sure you want to delete this role? Users with this role
                will lose their permissions.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteRoleConfirm(null)}
                  disabled={isDeletingRole}
                  className={`flex-1 px-6 py-3 ${cancelButton} disabled:opacity-50 ${textPrimary} rounded-xl transition-all font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteRole(showDeleteRoleConfirm)}
                  disabled={isDeletingRole}
                  className={`flex-1 px-6 py-3 ${deleteButton} disabled:opacity-50 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2`}
                >
                  {isDeletingRole ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manage Permissions Modal */}
        {showManagePermissionsModal && selectedRoleForPermissions && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}
            onClick={() => setShowManagePermissionsModal(false)}
          >
            <div
              className={`${modalBg} border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-inherit border-b border-opacity-20 p-6 flex items-center justify-between">
                <div>
                  <h2
                    className={`text-2xl font-bold ${textPrimary} flex items-center gap-2`}
                  >
                    <Key className="w-6 h-6 text-indigo-500" />
                    Manage Permissions
                  </h2>
                  <p className={textSecondary}>
                    {selectedRoleForPermissions.name} - Select permissions to
                    assign
                  </p>
                </div>
                <button
                  onClick={() => setShowManagePermissionsModal(false)}
                  className={`p-2 hover:bg-opacity-10 rounded-lg transition-colors`}
                >
                  <X className={`w-6 h-6 ${textSecondary}`} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className={`${textSecondary} text-sm`}>
                    {selectedPermissionIds.length} of {permissions.length}{" "}
                    permissions selected
                  </p>
                </div>
                {permissionsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                  </div>
                ) : permissions.length === 0 ? (
                  <div className={`text-center py-12 ${textSecondary}`}>
                    <Key className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No permissions available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        onClick={() => togglePermissionSelection(permission.id)}
                        className={`p-4 ${
                          selectedPermissionIds.includes(permission.id)
                            ? isDark
                              ? "bg-indigo-900/50 border-indigo-500"
                              : "bg-indigo-100 border-indigo-500"
                            : isDark
                              ? "bg-slate-800 border-slate-700"
                              : "bg-white border-indigo-200"
                        } border-2 rounded-lg cursor-pointer transition-all hover:scale-105`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getPermissionIcon(permission.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`${textPrimary} text-sm font-semibold flex items-center justify-between`}
                            >
                              {permission.name}
                              {selectedPermissionIds.includes(
                                permission.id,
                              ) && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <div className={`${textSecondary} text-xs mt-0.5`}>
                              {permission.slug}
                            </div>
                            <div className={`${textSecondary} text-xs mt-1`}>
                              {permission.action} • {permission.resource}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-opacity-20 p-6 flex gap-3">
                <button
                  onClick={() => setShowManagePermissionsModal(false)}
                  disabled={isAssigningPermissions}
                  className={`flex-1 px-6 py-3 ${cancelButton} disabled:opacity-50 ${textPrimary} rounded-xl transition-all font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={assignPermissionsToRole}
                  disabled={isAssigningPermissions}
                  className={`flex-1 px-6 py-3 ${buttonPrimary} disabled:opacity-50 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2`}
                >
                  {isAssigningPermissions ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Permissions
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Role Assignment Modal */}
        {showRoleAssignModal && userForRoleManagement && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}
            onClick={() => setShowRoleAssignModal(false)}
          >
            <div
              className={`${modalBg} border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-inherit border-b border-opacity-20 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {userForRoleManagement.avatarUrl ? (
                    <img
                      src={userForRoleManagement.avatarUrl}
                      alt={userForRoleManagement.username}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/20"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {userForRoleManagement.username?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                  )}
                  <div>
                    <h2
                      className={`text-2xl font-bold ${textPrimary} flex items-center gap-2`}
                    >
                      <Shield className="w-6 h-6 text-purple-500" />
                      Manage Roles
                    </h2>
                    <p className={textSecondary}>
                      {userForRoleManagement.fullName ||
                        userForRoleManagement.username}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRoleAssignModal(false)}
                  className={`p-2 hover:bg-opacity-10 rounded-lg transition-colors`}
                >
                  <X className={`w-6 h-6 ${textSecondary}`} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Current Roles Section */}
                <div>
                  <h3
                    className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Current Roles ({userForRoleManagement.roles?.length || 0})
                  </h3>

                  {userForRoleManagement.roles &&
                  userForRoleManagement.roles.length > 0 ? (
                    <div className="space-y-3">
                      {userForRoleManagement.roles.map((role) => (
                        <div
                          key={role.id}
                          className={`flex items-center justify-between p-4 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-indigo-200"} rounded-xl`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div
                              className={`p-3 rounded-lg ${getRoleBadgeColor(role.slug)} border`}
                            >
                              {getRoleIcon(role.slug)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className={`${textPrimary} font-semibold`}>
                                  {role.name}
                                </h4>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${isDark ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-600"}`}
                                >
                                  {role.slug}
                                </span>
                                {role.isSystem && (
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                                  >
                                    System
                                  </span>
                                )}
                              </div>
                              {role.description && (
                                <p className={`${textSecondary} text-sm mt-1`}>
                                  {role.description}
                                </p>
                              )}
                              <div className={`${textSecondary} text-xs mt-2`}>
                                {role.permissions?.length || 0} permission
                                {(role.permissions?.length || 0) !== 1
                                  ? "s"
                                  : ""}
                                {role.assignedAt && (
                                  <>
                                    {" • Assigned "}
                                    {new Date(
                                      role.assignedAt,
                                    ).toLocaleDateString()}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              removeRoleFromUser(
                                userForRoleManagement._id,
                                role.id,
                              )
                            }
                            disabled={isRemovingRole === role.id}
                            className={`ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-400 rounded-lg transition-all flex items-center gap-2 font-medium`}
                          >
                            {isRemovingRole === role.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                <span className="text-sm">Removing...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm">Remove</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={`text-center py-8 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-indigo-200"} rounded-xl`}
                    >
                      <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className={textSecondary}>
                        No roles assigned to this user
                      </p>
                    </div>
                  )}
                </div>

                {/* Available Roles to Assign */}
                <div>
                  <h3
                    className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}
                  >
                    <Settings className="w-5 h-5 text-purple-500" />
                    Available Roles to Assign
                  </h3>

                  {(() => {
                    const assignedRoleIds = new Set(
                      userForRoleManagement.roles?.map((r) => r.id) || [],
                    );
                    const availableRoles = roles.filter(
                      (role) => !assignedRoleIds.has(role.id),
                    );

                    return availableRoles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availableRoles.map((role) => (
                          <div
                            key={role.id}
                            className={`p-4 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-indigo-200"} rounded-xl hover:border-purple-500 transition-all`}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div
                                className={`p-2 rounded-lg ${getRoleBadgeColor(role.slug)} border`}
                              >
                                {getRoleIcon(role.slug)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4
                                    className={`${textPrimary} font-semibold`}
                                  >
                                    {role.name}
                                  </h4>
                                  {role.isSystem && (
                                    <span
                                      className={`px-2 py-0.5 rounded text-xs ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                                    >
                                      System
                                    </span>
                                  )}
                                </div>
                                {role.description && (
                                  <p className={`${textSecondary} text-xs`}>
                                    {role.description}
                                  </p>
                                )}
                                <div
                                  className={`${textSecondary} text-xs mt-2`}
                                >
                                  {role.permissions?.length || 0} permission
                                  {(role.permissions?.length || 0) !== 1
                                    ? "s"
                                    : ""}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                assignRoleToUser(
                                  userForRoleManagement._id,
                                  role.id,
                                )
                              }
                              disabled={isAssigningRole}
                              className={`w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-purple-400 rounded-lg transition-all flex items-center justify-center gap-2 font-medium`}
                            >
                              {isAssigningRole ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                  <span className="text-sm">Assigning...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm">Assign Role</span>
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className={`text-center py-8 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-indigo-200"} rounded-xl`}
                      >
                        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500 opacity-50" />
                        <p className={textSecondary}>
                          All available roles have been assigned
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* Combined Permissions Preview */}
                {userForRoleManagement.roles &&
                  userForRoleManagement.roles.length > 0 && (
                    <div>
                      <h3
                        className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}
                      >
                        <Key className="w-5 h-5 text-indigo-500" />
                        Combined Permissions
                      </h3>
                      {(() => {
                        const allPermissions = getAllUserPermissions(
                          userForRoleManagement,
                        );

                        return allPermissions.length > 0 ? (
                          <div>
                            <p className={`${textSecondary} text-sm mb-3`}>
                              This user has {allPermissions.length} unique
                              permission
                              {allPermissions.length !== 1 ? "s" : ""} across
                              all assigned roles
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {allPermissions.map((permission) => (
                                <div
                                  key={permission.id}
                                  className={`flex items-center gap-2 px-3 py-2 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-indigo-200"} rounded-lg text-xs`}
                                >
                                  {getPermissionIcon(permission.action)}
                                  <span className={textMuted}>
                                    {permission.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className={`${textSecondary} text-sm`}>
                            No permissions available
                          </p>
                        );
                      })()}
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center z-50`}
          >
            <div
              className={`${modalBg} border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl`}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3
                className={`text-2xl font-bold ${textPrimary} mb-3 text-center`}
              >
                Confirm Deletion
              </h3>
              <p className={`${textSecondary} mb-6 text-center`}>
                Are you sure you want to delete this user? This action cannot be
                undone and all associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={isDeleting}
                  className={`flex-1 px-6 py-3 ${cancelButton} disabled:opacity-50 disabled:cursor-not-allowed ${textPrimary} rounded-xl transition-all font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteUser(showDeleteConfirm)}
                  disabled={isDeleting}
                  className={`flex-1 px-6 py-3 ${deleteButton} disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2`}
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
