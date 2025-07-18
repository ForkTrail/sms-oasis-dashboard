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
  ExternalLink
} from "lucide-react"

const AdminDashboard = () => {
  const stats = {
    totalSMS: 45789,
    activeUsers: 2847,
    creditsSold: 156234,
    revenue: 2890450
  }

  const chartData = [
    { name: "Mon", sms: 4000, credits: 2400 },
    { name: "Tue", sms: 3000, credits: 1398 },
    { name: "Wed", sms: 2000, credits: 9800 },
    { name: "Thu", sms: 2780, credits: 3908 },
    { name: "Fri", sms: 1890, credits: 4800 },
    { name: "Sat", sms: 2390, credits: 3800 },
    { name: "Sun", sms: 3490, credits: 4300 },
  ]

  const recentActivity = [
    {
      id: 1,
      user: "john@example.com",
      action: "Purchased 75 credits",
      timestamp: "2 minutes ago",
      amount: "₦1,400"
    },
    {
      id: 2,
      user: "sarah@example.com",
      action: "SMS verification - Google",
      timestamp: "5 minutes ago",
      amount: "2 credits"
    },
    {
      id: 3,
      user: "mike@example.com",
      action: "Account registration",
      timestamp: "12 minutes ago",
      amount: "Free"
    },
    {
      id: 4,
      user: "emma@example.com",
      action: "Purchased 150 credits",
      timestamp: "18 minutes ago",
      amount: "₦2,600"
    }
  ]

  const serverStats = [
    { name: "Server 1", status: "online", load: "23%", uptime: "99.8%" },
    { name: "Server 2", status: "online", load: "67%", uptime: "99.5%" },
    { name: "Server 3", status: "maintenance", load: "0%", uptime: "98.2%" },
    { name: "Server 4", status: "online", load: "45%", uptime: "99.9%" }
  ]

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
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          <Button className="bg-gradient-to-r from-primary to-primary-glow">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total SMS Sent</CardTitle>
            <MessageSquare className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalSMS.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="w-4 h-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Credits Sold</CardTitle>
            <CreditCard className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.creditsSold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₦{stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Daily Usage & Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Chart visualization would go here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Interactive chart showing SMS usage and credit purchases
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent User Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{activity.user}</div>
                      <div className="text-xs text-muted-foreground">{activity.action}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{activity.amount}</div>
                    <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Server Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Server Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {serverStats.map((server) => (
              <div key={server.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{server.name}</h4>
                  <Badge variant={getStatusColor(server.status) as any}>
                    {server.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Load:</span>
                    <span className="font-medium">{server.load}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime:</span>
                    <span className="font-medium">{server.uptime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard