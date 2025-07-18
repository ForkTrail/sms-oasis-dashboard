import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CreditCard, 
  Smartphone, 
  Activity, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Copy,
  ExternalLink
} from "lucide-react"

const Dashboard = () => {
  const userStats = {
    credits: 45,
    activeNumbers: 2,
    todayUsage: 8,
    successRate: "94%"
  }

  const serverStatus = [
    { name: "Server 1", status: "online", uptime: "99.8%", load: "23%" },
    { name: "Server 2", status: "online", uptime: "99.5%", load: "67%" }
  ]

  const recentActivities = [
    {
      id: 1,
      service: "Google",
      number: "+1 555-0123",
      status: "completed",
      time: "2 minutes ago",
      messages: 2
    },
    {
      id: 2,
      service: "WhatsApp",
      number: "+1 555-0124",
      status: "active",
      time: "5 minutes ago",
      messages: 1
    },
    {
      id: 3,
      service: "Telegram",
      number: "+1 555-0125", 
      status: "completed",
      time: "12 minutes ago",
      messages: 3
    },
    {
      id: 4,
      service: "Discord",
      number: "+1 555-0126",
      status: "expired",
      time: "1 hour ago",
      messages: 0
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": 
      case "completed": 
        return "success"
      case "active": 
        return "info"
      case "expired": 
        return "secondary"
      default: 
        return "destructive"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "active":
        return <Activity className="w-4 h-4" />
      case "expired":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-6 border">
        <h1 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h1>
        <p className="text-muted-foreground mb-4">
          Here's what's happening with your SMS verification services today.
        </p>
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
            <Smartphone className="w-4 h-4 mr-2" />
            Get New Number
          </Button>
          <Button variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Purchase Credits
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining Credits
            </CardTitle>
            <CreditCard className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{userStats.credits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Numbers
            </CardTitle>
            <Smartphone className="w-4 h-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{userStats.activeNumbers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 sessions running
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Usage
            </CardTitle>
            <Activity className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{userStats.todayUsage}</div>
            <p className="text-xs text-muted-foreground mt-1">
              SMS received
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{userStats.successRate}</div>
            <p className="text-xs text-muted-foreground mt-1">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Server Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {serverStatus.map((server) => (
              <div key={server.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(server.status)}
                  <div>
                    <div className="font-medium">{server.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Uptime: {server.uptime}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusColor(server.status) as any} className="mb-1">
                    {server.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Load: {server.load}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent SMS Activities
            </CardTitle>
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{activity.service}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        {activity.number}
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(activity.status) as any} className="mb-1">
                      {activity.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {activity.messages} messages • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard