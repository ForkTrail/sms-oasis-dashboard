import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Activity, 
  Search, 
  Filter, 
  Download,
  Clock,
  Smartphone,
  Users,
  Server,
  RefreshCw
} from "lucide-react"

const ActivityTracking = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceFilter, setServiceFilter] = useState("")
  const [serverFilter, setServerFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const activities = [
    {
      id: 1,
      user: "john@example.com",
      number: "+1 555-0123",
      service: "Google",
      server: "Server 1",
      startTime: "2024-01-15 14:32:15",
      endTime: "2024-01-15 14:36:00",
      duration: "3m 45s",
      status: "completed",
      messagesReceived: 2,
      ipAddress: "192.168.1.1"
    },
    {
      id: 2,
      user: "sarah@example.com",
      number: "+1 555-0124",
      service: "WhatsApp",
      server: "Server 2",
      startTime: "2024-01-15 12:15:30",
      endTime: "2024-01-15 12:17:42",
      duration: "2m 12s",
      status: "completed",
      messagesReceived: 1,
      ipAddress: "192.168.1.2"
    },
    {
      id: 3,
      user: "mike@example.com",
      number: "+1 555-0125",
      service: "Telegram",
      server: "Server 1",
      startTime: "2024-01-14 16:45:22",
      endTime: "2024-01-14 16:50:40",
      duration: "5m 18s",
      status: "completed",
      messagesReceived: 3,
      ipAddress: "192.168.1.3"
    },
    {
      id: 4,
      user: "emma@example.com",
      number: "+1 555-0126",
      service: "Discord",
      server: "Server 2",
      startTime: "2024-01-14 09:23:11",
      endTime: "2024-01-14 09:38:11",
      duration: "15m 00s",
      status: "expired",
      messagesReceived: 0,
      ipAddress: "192.168.1.4"
    },
    {
      id: 5,
      user: "david@example.com",
      number: "+1 555-0127",
      service: "Facebook",
      server: "Server 1",
      startTime: "2024-01-13 20:11:44",
      endTime: "2024-01-13 20:13:17",
      duration: "1m 33s",
      status: "completed",
      messagesReceived: 1,
      ipAddress: "192.168.1.5"
    },
    {
      id: 6,
      user: "lisa@example.com",
      number: "+1 555-0128",
      service: "Instagram",
      server: "Server 2",
      startTime: "2024-01-13 15:05:17",
      endTime: "2024-01-13 15:09:39",
      duration: "4m 22s",
      status: "completed",
      messagesReceived: 2,
      ipAddress: "192.168.1.6"
    },
    {
      id: 7,
      user: "alex@example.com",
      number: "+1 555-0129",
      service: "Twitter",
      server: "Server 1",
      startTime: "2024-01-12 11:30:55",
      endTime: "2024-01-12 11:31:40",
      duration: "0m 45s",
      status: "cancelled",
      messagesReceived: 0,
      ipAddress: "192.168.1.7"
    },
    {
      id: 8,
      user: "jenny@example.com",
      number: "+1 555-0130",
      service: "TikTok",
      server: "Server 2",
      startTime: "2024-01-12 08:17:33",
      endTime: "2024-01-12 08:24:44",
      duration: "7m 11s",
      status: "completed",
      messagesReceived: 4,
      ipAddress: "192.168.1.8"
    },
    {
      id: 9,
      user: "tom@example.com",
      number: "+1 555-0131",
      service: "Google",
      server: "Server 1",
      startTime: "2024-01-15 16:22:10",
      endTime: null,
      duration: "12m 34s",
      status: "active",
      messagesReceived: 1,
      ipAddress: "192.168.1.9"
    },
    {
      id: 10,
      user: "kate@example.com",
      number: "+1 555-0132",
      service: "WhatsApp",
      server: "Server 2",
      startTime: "2024-01-15 15:45:22",
      endTime: null,
      duration: "43m 12s",
      status: "active",
      messagesReceived: 3,
      ipAddress: "192.168.1.10"
    }
  ]

  const services = [...new Set(activities.map(item => item.service))]
  const servers = [...new Set(activities.map(item => item.server))]
  const statuses = [...new Set(activities.map(item => item.status))]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success"
      case "active": return "info"
      case "expired": return "warning"
      case "cancelled": return "destructive"
      default: return "secondary"
    }
  }

  const getServiceIcon = (service: string) => {
    const icons: { [key: string]: string } = {
      "Google": "🔍",
      "WhatsApp": "💬",
      "Telegram": "✈️",
      "Discord": "🎮",
      "Facebook": "📘",
      "Instagram": "📷",
      "Twitter": "🐦",
      "TikTok": "🎵"
    }
    return icons[service] || "📱"
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.number.includes(searchTerm) ||
      activity.service.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesService = !serviceFilter || activity.service === serviceFilter
    const matchesServer = !serverFilter || activity.server === serverFilter
    const matchesStatus = !statusFilter || activity.status === statusFilter

    return matchesSearch && matchesService && matchesServer && matchesStatus
  })

  const totalSessions = activities.length
  const activeSessions = activities.filter(a => a.status === "active").length
  const completedSessions = activities.filter(a => a.status === "completed").length
  const expiredSessions = activities.filter(a => a.status === "expired").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Activity Tracking</h1>
          <p className="text-muted-foreground">
            Monitor all SMS verification sessions in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-primary to-primary-glow">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold text-info">{activeSessions}</p>
              </div>
              <Clock className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">{completedSessions}</p>
              </div>
              <Smartphone className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-warning">{expiredSessions}</p>
              </div>
              <Users className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Services</SelectItem>
                {services.map(service => (
                  <SelectItem key={service} value={service}>
                    {getServiceIcon(service)} {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={serverFilter} onValueChange={setServerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by server" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Servers</SelectItem>
                {servers.map(server => (
                  <SelectItem key={server} value={server}>
                    <Server className="w-4 h-4 mr-2" />
                    {server}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Session Activity ({filteredActivities.length} results)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Messages</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="font-medium">{activity.user}</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.ipAddress}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{activity.number}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getServiceIcon(activity.service)}</span>
                        <span className="font-medium">{activity.service}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {activity.server}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {activity.startTime}
                    </TableCell>
                    <TableCell className="text-sm">
                      {activity.endTime || (
                        <Badge variant="default" className="text-xs">
                          Running
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {activity.duration}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(activity.status) as any}>
                        {activity.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {activity.messagesReceived}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredActivities.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No activities found matching your filters</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ActivityTracking