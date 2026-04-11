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
  CloudCog,
  Brain,
} from "lucide-react";
import dynamic from "next/dynamic";

const NewDashboard = dynamic(
  () => import("../features/dashboard/newDashboard"),
  { ssr: false },
);

const ProjectManagerDashboard = dynamic(
  () => import("../features/ProjectManager/Project"),
  { ssr: false },
);
const BlogUpload = dynamic(
  () =>
    import("../features/BlogUpload/BlogUpload").then((m) => ({
      default: m.BlogUpload,
    })),
  { ssr: false },
);
const ContactResponse = dynamic(
  () => import("../features/PortfolioResponses/ContactResponse"),
  { ssr: false },
);
const WeeklyVisitsDashboard = dynamic(
  () => import("../features/VisitTracker/WeeklyVisitsDashboard"),
  { ssr: false },
);
const Ipaddress = dynamic(() => import("../features/IpDatabase/Ipaddress"), {
  ssr: false,
});
const ConversionPage = dynamic(
  () => import("../features/BinaryConverter/ConversionPage"),
  { ssr: false },
);
const AniListViewer = dynamic(
  () => import("../features/anime-list/AniListViewer"),
  { ssr: false },
);
const DriveVideoPlayer = dynamic(
  () => import("../features/DVIDEO/videoPlayer"),
  { ssr: false },
);
const RBACManagement = dynamic(() => import("../features/RBAC/page"), {
  ssr: false,
});
const CombinedDashboard = dynamic(
  () => import("../features/routeDashboard/page"),
  { ssr: false },
);
const ApiKeyManagement = dynamic(() => import("../features/ApiKeys/page"), {
  ssr: false,
});
const OllamaPage = dynamic(() => import("../features/LLM/page"), {
  ssr: false,
});

export const adminFeatures = {
  // ── System ────────────────────────────────────────────────────────────────
  newDashboard: {
    title: "Dashboard",
    icon: LayoutDashboard,
    group: "system",
    component: NewDashboard,
    roles: ["admin"],
    description: "Overview and analytics",
  },

  // ── Access control ────────────────────────────────────────────────────────
  RBAC: {
    title: "RBAC",
    icon: UserLock,
    group: "access",
    component: RBACManagement,
    roles: ["admin"],
    description: "Role based access control",
  },
  api: {
    title: "API Keys",
    icon: CloudCog,
    group: "access",
    component: ApiKeyManagement,
    roles: ["admin"],
    description: "API keys for microservices",
  },
  routes: {
    title: "Routes",
    icon: Route,
    group: "access",
    component: CombinedDashboard,
    roles: ["admin"],
    description: "Route discovery",
  },

  // ── Content ───────────────────────────────────────────────────────────────
  projects: {
    title: "Projects",
    icon: Folder,
    group: "content",
    component: ProjectManagerDashboard,
    roles: ["admin"],
    description: "Upload and manage projects",
  },
  blog: {
    title: "Blog Upload",
    icon: BookOpen,
    group: "content",
    component: BlogUpload,
    roles: ["admin"],
    description: "Create and manage blog posts",
  },
  messages: {
    title: "Messages",
    icon: MessageSquare,
    group: "content",
    component: ContactResponse,
    roles: ["admin"],
    description: "View contact form responses",
  },

  // ── Analytics ─────────────────────────────────────────────────────────────
  visitTracker: {
    title: "Visit Tracker",
    icon: ChartColumn,
    group: "analytics",
    component: WeeklyVisitsDashboard,
    roles: ["admin"],
    description: "Analytics and visitor tracking",
  },
  ip: {
    title: "IP Addresses",
    icon: Globe,
    group: "analytics",
    component: Ipaddress,
    roles: ["admin"],
    description: "Track IP addresses",
  },

  // ── Tools ─────────────────────────────────────────────────────────────────
  OLLAMA: {
    title: "Ollama LLM",
    icon: Brain,
    group: "tools",
    component: OllamaPage,
    roles: ["admin"],
    description: "Chat with local LLM",
  },
  converter: {
    title: "Binary Converter",
    icon: Binary,
    group: "tools",
    component: ConversionPage,
    roles: ["admin", "viewer"],
    description: "Number system converter",
  },
  alist: {
    title: "Anime List",
    icon: ListCheck,
    group: "tools",
    component: AniListViewer,
    roles: ["admin"],
    description: "Anime list from AniList",
  },
  dvideo: {
    title: "Drive Videos",
    icon: FilePlay,
    group: "tools",
    component: DriveVideoPlayer,
    roles: ["admin"],
    description: "Drive playable videos",
  },
};

export const getFeaturesByRole = (role) =>
  Object.entries(adminFeatures)
    .filter(([, feature]) => feature.roles.includes(role))
    .reduce((acc, [key, feature]) => ({ ...acc, [key]: feature }), {});

// Controls the display order of groups in the sidebar
export const GROUP_ORDER = [
  "system",
  "access",
  "content",
  "analytics",
  "tools",
];

// Human-readable group labels shown in sidebar
export const GROUP_LABELS = {
  system: "System",
  access: "Access & API",
  content: "Content",
  analytics: "Analytics",
  tools: "Tools",
};
