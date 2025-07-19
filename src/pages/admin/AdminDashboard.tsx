import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  DollarSign, 
  TrendingUp,
  Activity,
  CreditCard,
  Shield,
  ExternalLink,
  LogOut
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

import { useEffect, useState } from "react"
// ...existing imports...

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalSMS: 0, activeUsers: 0, creditsSold: 0, revenue: 0 })
  const [recentActivity, setRecentActivity] = useState([])
  const [serverStats, setServerStats] = useState([])

  useEffect(() => {
    // Fetch stats from Supabase
    async function fetchStats() {
        // Fetch stats and health checks dynamically
        const { count: smsCount } = await supabase.from("sms_sessions").select("id", { count: "exact", head: true })
        const { count: userCount } = await supabase.from("users").select("id", { count: "exact", head: true })
        const { data: creditsData } = await supabase.from("transactions").select("amount")
        const revenue = creditsData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
        setStats({
          totalSMS: smsCount || 0,
          activeUsers: userCount || 0,
          creditsSold: creditsData?.length || 0,
          revenue
        })
    }
    async function fetchActivity() {
      const { data } = await supabase.from("logs").select("description, created_at").order("created_at", { ascending: false }).limit(5)
      setRecentActivity(data || [])
    }
    async function fetchServerStats() {
      // Example: Replace with real queries
        // Fetch server health dynamically (replace with real API if available)
        const { data: health } = await supabase.from("server_health").select("name, status")
        setServerStats(health || [])
    }
    fetchStats(); fetchActivity(); fetchServerStats();
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/auth")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "success"
      case "maintenance": return "warning"
      case "offline": return "destructive"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor platform performance and user activity
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/users")}> <Users className="w-4 h-4 mr-2" /> Manage Users </Button>
          <Button variant="outline" onClick={() => navigate("/admin/activity")}> <Activity className="w-4 h-4 mr-2" /> Activity </Button>
          <Button className="bg-gradient-to-r from-primary to-primary-glow"> <BarChart3 className="w-4 h-4 mr-2" /> Analytics </Button>
          <Button variant="destructive" onClick={handleLogout}> <LogOut className="w-4 h-4 mr-2" /> Logout </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle>Total SMS</CardTitle></CardHeader><CardContent>{stats.totalSMS}</CardContent></Card>
        <Card><CardHeader><CardTitle>Active Users</CardTitle></CardHeader><CardContent>{stats.activeUsers}</CardContent></Card>
        <Card><CardHeader><CardTitle>Credits Sold</CardTitle></CardHeader><CardContent>{stats.creditsSold}</CardContent></Card>
        <Card><CardHeader><CardTitle>Revenue</CardTitle></CardHeader><CardContent>₦{stats.revenue}</CardContent></Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-bold mb-2">Recent Activity</h2>
        <ul className="space-y-2">
          {recentActivity.map((act, idx) => (
            <li key={idx} className="flex justify-between items-center p-2 border rounded">
              <span>{act.description}</span>
              <Badge>{new Date(act.created_at).toLocaleString()}</Badge>
            </li>
          ))}
        </ul>
      </div>

      {/* System Health */}
      <div>
        <h2 className="text-lg font-bold mb-2">System Health</h2>
        <div className="flex gap-4">
          {serverStats.map((srv, idx) => (
            <Card key={idx} className="flex-1">
              <CardHeader><CardTitle>{srv.name}</CardTitle></CardHeader>
              <CardContent><Badge variant={getStatusColor(srv.status)}>{srv.status}</Badge></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
