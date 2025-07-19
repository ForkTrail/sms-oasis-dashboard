import { NavLink, useLocation } from "react-router-dom"
import LogoutButton from "@/components/LogoutButton" // ✅ Import here
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Smartphone,
  CreditCard,
  History,
  Settings,
  Users,
  Activity,
  BarChart3,
  DollarSign,
  FileText,
  Shield,
  Cog
} from "lucide-react"

const userMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Get Number", url: "/get-number", icon: Smartphone },
  { title: "Purchase Credits", url: "/purchase-credits", icon: CreditCard },
  { title: "History", url: "/history", icon: History },
  { title: "Profile", url: "/profile", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
]

const adminMenuItems = [
  { title: "Admin Dashboard", url: "/admin", icon: BarChart3 },
  { title: "User Management", url: "/admin/users", icon: Users },
  { title: "Activity Tracking", url: "/admin/activity", icon: Activity },
  { title: "Service Management", url: "/admin/services", icon: Shield },
  { title: "Transactions", url: "/admin/transactions", icon: DollarSign },
  { title: "System Logs", url: "/admin/logs", icon: FileText },
  { title: "Configuration", url: "/admin/config", icon: Cog },
]

interface AppSidebarProps {
  isAdmin?: boolean
}

export function AppSidebar({ isAdmin = false }: AppSidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true
    if (path !== "/" && currentPath.startsWith(path)) return true
    return false
  }

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50"

  return (
    <Sidebar className="border-r min-h-screen flex flex-col justify-between">
      <SidebarContent className="bg-card flex flex-col justify-between h-full">
        <div>
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg">SMS Oasis</h2>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? "Admin Panel" : "Verification Hub"}
                </p>
              </div>
            </div>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel>
              {isAdmin ? "Admin Menu" : "Main Menu"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls(item.url)}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* ✅ LOGOUT BUTTON SECTION */}
        <div className="p-4 border-t">
          <LogoutButton />
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
