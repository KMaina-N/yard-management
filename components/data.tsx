import {
  BarChart,
  Bookmark,
  BookOpen,
  Brush,
  CheckCircle,
  Clock,
  Code,
  CuboidIcon,
  FileText,
  Grid,
  Home,
  ImageIcon,
  Layers,
  LayoutGrid,
  Package,
  Settings,
  TrendingUp,
  Users,
  Video,
  Wrench,
} from "lucide-react"

import type {
  App,
  CommunityPost,
  Project,
  RecentFile,
  SidebarItem,
  Tutorial,
} from "./types"

export const apps: App[] = [
  {
    name: "PixelMaster",
    icon: <ImageIcon className="text-violet-500" />,
    description: "Advanced image editing and composition",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VectorPro",
    icon: <Brush className="text-orange-500" />,
    description: "Professional vector graphics creation",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VideoStudio",
    icon: <Video className="text-pink-500" />,
    description: "Cinematic video editing and production",
    category: "Video",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "UXFlow",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    description: "Intuitive user experience design",
    category: "Design",
    recent: false,
    new: true,
    progress: 85,
  },
  {
    name: "WebCanvas",
    icon: <Code className="text-emerald-500" />,
    description: "Web design and development",
    category: "Web",
    recent: false,
    new: true,
    progress: 70,
  },
  {
    name: "3DStudio",
    icon: <CuboidIcon className="text-indigo-500" />,
    description: "3D modeling and rendering",
    category: "3D",
    recent: false,
    new: true,
    progress: 60,
  },
]

export const recentFiles: RecentFile[] = [
  {
    name: "Brand Redesign.pxm",
    app: "PixelMaster",
    modified: "2 hours ago",
    icon: <ImageIcon className="text-violet-500" />,
    shared: true,
    size: "24.5 MB",
    collaborators: 3,
  },
  {
    name: "Company Logo.vec",
    app: "VectorPro",
    modified: "Yesterday",
    icon: <Brush className="text-orange-500" />,
    shared: true,
    size: "8.2 MB",
    collaborators: 2,
  },
  {
    name: "Product Launch Video.vid",
    app: "VideoStudio",
    modified: "3 days ago",
    icon: <Video className="text-pink-500" />,
    shared: false,
    size: "1.2 GB",
    collaborators: 0,
  },
]

export const projects: Project[] = [
  {
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    progress: 75,
    dueDate: "June 15, 2025",
    members: 4,
    files: 23,
  },
  {
    name: "Mobile App Launch",
    description: "Design and assets for new mobile application",
    progress: 60,
    dueDate: "July 30, 2025",
    members: 6,
    files: 42,
  },
  {
    name: "Brand Identity",
    description: "New brand guidelines and assets",
    progress: 90,
    dueDate: "May 25, 2025",
    members: 3,
    files: 18,
  },
]

export const tutorials: Tutorial[] = [
  {
    title: "Mastering Digital Illustration",
    description: "Learn advanced techniques for creating stunning digital art",
    duration: "1h 45m",
    level: "Advanced",
    instructor: "Sarah Chen",
    category: "Illustration",
    views: "24K",
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Essential principles for creating intuitive user interfaces",
    duration: "2h 20m",
    level: "Intermediate",
    instructor: "Michael Rodriguez",
    category: "Design",
    views: "56K",
  },
]

export const communityPosts: CommunityPost[] = [
  {
    title: "Minimalist Logo Design",
    author: "Alex Morgan",
    likes: 342,
    comments: 28,
    image: "/placeholder.svg?height=300&width=400",
    time: "2 days ago",
  },
  {
    title: "3D Character Concept",
    author: "Priya Sharma",
    likes: 518,
    comments: 47,
    image: "/placeholder.svg?height=300&width=400",
    time: "1 week ago",
  },
]



export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: <Home className="h-4 w-4" />,
    isActive: true,
    url: "/admin/dashboard",
  },
  {
    title: "Bookings",
    icon: <Layers className="h-4 w-4" />,
    badge: "3",
    items: [
      { title: "All Bookings", url: "/admin/bookings" },
      { title: "Pending Approvals", url: "/admin/bookings/pending", badge: "2" },
      { title: "Reschedules", url: "/admin/bookings/reschedules" },
    ],
  },
  {
    title: "Configurations",
    icon: <Wrench className="h-4 w-4" />,
    items: [
      { title: "Yards", url: "/admin/configurations/yards" },
      { title: "Product Types", url: "/admin/configurations/product-types" },
      { title: "Delivery Rules", url: "/admin/configurations/delivery-rules" },
      // { title: "Suppliers", url: "/admin/suppliers" },
    ],
  },
  {
    title: "Users",
    icon: <Users className="h-4 w-4" />,
    items: [
      { title: "All Users", url: "/admin/users" },
      { title: "Roles & Permissions", url: "/admin/users/roles" },
      { title: "Audit Logs", url: "/admin/users/logs" },
    ],
  },
  // {
  //   title: "Products & Inventory",
  //   icon: <Package className="h-4 w-4" />,
  //   items: [
  //     { title: "Product List", url: "/admin/products" },
  //     { title: "Stock Levels", url: "/admin/inventory/stock" },
  //     { title: "Suppliers", url: "/admin/suppliers" },
  //   ],
  // },
  {
    title: "Reports",
    icon: <BarChart className="h-4 w-4" />,
    items: [
      { title: "Daily Reports", url: "/admin/reports/daily" },
      { title: "Monthly Reports", url: "/admin/reports/monthly" },
      { title: "Custom Reports", url: "/admin/reports/custom" },
    ],
  },
  {
    title: "Settings",
    icon: <Settings className="h-4 w-4" />,
    items: [
      { title: "System Settings", url: "/admin/settings/system" },
      { title: "Notifications", url: "/admin/settings/notifications" },
      { title: "Integrations", url: "/admin/settings/integrations" },
    ],
  },
  {
    title: "Documents",
    icon: <FileText className="h-4 w-4" />,
    items: [
      { title: "Invoices", url: "/admin/documents/invoices" },
      { title: "Delivery Notes", url: "/admin/documents/delivery-notes" },
      { title: "Packing Lists", url: "/admin/documents/packing-lists" },
    ],
  },
];

export const stats = [
  { 
    title: "Total Platforms", 
    value: "12", 
    icon: Package, 
    change: "+2 this month",
    trend: "+16.7%",
    color: "text-primary"
  },
  { 
    title: "Active Bookings", 
    value: "8", 
    icon: Clock, 
    change: "3 arriving today",
    trend: "+8.3%",
    color: "text-orange-500"
  },
  { 
    title: "Completed Today", 
    value: "15", 
    icon: CheckCircle, 
    change: "+12% vs yesterday",
    trend: "+12%",
    color: "text-green-600"
  },
  { 
    title: "Utilization Rate", 
    value: "67%", 
    icon: TrendingUp, 
    change: "+5% this week",
    trend: "+5%",
    color: "text-blue-500"
  },
];

export const recentBookings = [
  { id: "BK-1001", company: "ABC Logistics", platform: "A-1", time: "09:00 - 11:00", status: "confirmed", priority: "high" },
  { id: "BK-1002", company: "XYZ Transport", platform: "B-3", time: "11:00 - 13:00", status: "in-progress", priority: "medium" },
  { id: "BK-1003", company: "Global Freight", platform: "A-2", time: "13:00 - 15:00", status: "confirmed", priority: "low" },
  { id: "BK-1004", company: "Swift Cargo", platform: "C-1", time: "15:00 - 17:00", status: "pending", priority: "high" },
];

export const platformStatus = [
  { name: "A-1", status: "occupied", booking: "BK-1002", utilization: 85 },
  { name: "A-2", status: "available", utilization: 0 },
  { name: "B-1", status: "occupied", booking: "BK-1005", utilization: 92 },
  { name: "B-2", status: "available", utilization: 0 },
  { name: "B-3", status: "reserved", booking: "BK-1003", utilization: 78 },
  { name: "C-1", status: "available", utilization: 0 },
];