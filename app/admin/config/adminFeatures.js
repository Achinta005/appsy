import {
  Folder,
  BookOpen,
  MessageSquare,
  ChartColumn,
  Server,
  Globe,
  Binary,
  Activity,
  FilePlay,
  LayoutDashboard,
  ListCheck,
  UserLock,
  Route,
} from "lucide-react";

// Import your feature components
import DashboardHome from "../features/dashboard/DashboardHome";
import Project from "../features/ProjectUpload/Project";
import { BlogUpload } from "../features/BlogUpload/BlogUpload";
import ContactResponse from "../features/PortfolioResponses/ContactResponse";
import WeeklyVisitsDashboard from "../features/VisitTracker/WeeklyVisitsDashboard";
import RenderServiceDashboard from "../features/Server/backendHealthCheck";
import Ipaddress from "../features/IpDatabase/Ipaddress";
import ConversionPage from "../features/BinaryConverter/ConversionPage";
// import Notepad from "../features/Notepad/Notepad";
import AniListViewer from "../features/anime-list/AniListViewer";
import DriveVideoPlayer from "../features/DVIDEO/videoPlayer";
import RBACManagement from "../features/RBAC/page";
import ActivitiesPage from "../features/Activity/activity";
import CombinedDashboard from "../features/routeDashboard/page";

export const adminFeatures = {
  dashboard: {
    title: "Dashboard",
    icon: LayoutDashboard,
    gradient: "from-purple-500 to-pink-500",
    component: DashboardHome,
    roles: ["admin"],
    description: "Overview and analytics",
  },
  RBAC: {
    title: "RBAC",
    icon: UserLock,
    gradient: "from-pink-500 to-teal-500",
    component: RBACManagement,
    roles: ["admin"],
    description: "Role Based Access Control",
  },
  activity: {
    title: "Recent Activities",
    icon: Activity,
    gradient: "from-indigo-500 to-blue-500",
    component: ActivitiesPage,
    roles: ["admin"],
    description: "Check Recent Activities",
  },
  projects: {
    title: "Manage Projects",
    icon: Folder,
    gradient: "from-blue-500 to-purple-500",
    image:
      "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a1_cqsx8x.jpg",
    component: Project,
    roles: ["admin"],
    description: "Upload and manage projects",
  },

  blog: {
    title: "Blog Upload",
    icon: BookOpen,
    gradient: "from-cyan-500 to-blue-500",
    image:
      "https://res.cloudinary.com/dc1fkirb4/image/upload/v1756037563/write-a-great-blog-post_ivsbz9.jpg",
    component: BlogUpload,
    roles: ["admin"],
    description: "Create and manage blog posts",
  },

  messages: {
    title: "View Messages",
    icon: MessageSquare,
    gradient: "from-indigo-500 to-blue-500",
    image:
      "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a2_jjgzr3.png",
    component: ContactResponse,
    roles: ["admin"],
    description: "View contact form responses",
  },

  visitTracker: {
    title: "Track Portfolio Visits",
    icon: ChartColumn,
    gradient: "from-pink-500 to-teal-500",
    image:
      "https://res.cloudinary.com/dc1fkirb4/image/upload/v1765812000/17-what_cc424d55614b9ae928b5_vzjkj1.png",
    component: WeeklyVisitsDashboard,
    roles: ["admin"],
    description: "Analytics and visitor tracking",
  },
  routes: {
    title: "Routes",
    icon: Route,
    gradient: "from-purple-500 to-pink-500",
    component: CombinedDashboard,
    roles: ["admin"],
    description: "Routes Discovery",
  },
  render: {
    title: "Render Health Check",
    icon: Server,
    gradient: "from-blue-500 to-purple-500",
    image:
      "https://res.cloudinary.com/dc1fkirb4/image/upload/v1763994657/render-dashboard_qyvptu.png",
    component: RenderServiceDashboard,
    roles: ["admin"],
    description: "Monitor backend services",
  },

  ip: {
    title: "IP Addresses",
    icon: Globe,
    gradient: "from-green-500 to-teal-500",
    image:
      "https://res.cloudinary.com/dc1fkirb4/image/upload/v1761317160/ip-address-lookup_czcb34.jpg",
    component: Ipaddress,
    roles: ["admin"],
    description: "Track IP addresses",
  },

  converter: {
    title: "Binary Converter",
    icon: Binary,
    gradient: "from-pink-500 to-teal-500",
    image:
      "https://www.wikihow.com/images/thumb/9/96/Convert-from-Binary-to-Decimal-Step-4-Version-6.jpg/v4-460px-Convert-from-Binary-to-Decimal-Step-4-Version-6.jpg",
    component: ConversionPage,
    roles: ["admin", "viewer"],
    description: "Number system converter",
  },
  alist: {
    title: "Anime List",
    icon: ListCheck,
    gradient: "from-cyan-500 to-blue-500",
    image: "",
    component: AniListViewer,
    roles: ["admin"],
    description: "Anime List from AniList",
  },
  dvideo: {
    title: "Drive Videos",
    icon: FilePlay,
    gradient: "from-indigo-500 to-blue-500",
    image: "",
    component: DriveVideoPlayer,
    roles: ["admin"],
    description: "Drive Playable Videos",
  },

  // notepad: {
  //   title: "Notepad",
  //   icon: FileText,
  //   gradient: "from-purple-500 to-pink-500",
  //   image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a3_uutdd3.avif",
  //   component: Notepad,
  //   roles: ["admin", "editor"],
  //   description: "Personal note-taking",
  // },
};

// Helper to get features by role
export const getFeaturesByRole = (role) => {
  return Object.entries(adminFeatures)
    .filter(([_, feature]) => feature.roles.includes(role))
    .reduce((acc, [key, feature]) => ({ ...acc, [key]: feature }), {});
};
