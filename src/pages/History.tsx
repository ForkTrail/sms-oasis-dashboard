import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  History as HistoryIcon, 
  Filter, 
  Download, 
  Search,
  Calendar,
  Smartphone,
  MessageSquare,
  Copy,
  ExternalLink
} from "lucide-react"

const History = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceFilter, setServiceFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  const historyData = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:32:15",
      service: "Google",
      number: "+1 555-0123",
      messages: 2,
      status: "completed",
      duration: "3m 45s",
      creditsUsed: 2,
      server: "Server 1"
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "12:15:30",
      service: "WhatsApp",
      number: "+1 555-0124",
      messages: 1,
      status: "completed",
      duration: "2m 12s",
      creditsUsed: 3,
      server: "Server 2"
    },
    {
      id: 3,
      date: "2024-01-14",
      time: "16:45:22",
      service: "Telegram",
      number: "+1 555-0125",
      messages: 3,
      status: "completed",
      duration: "5m 18s",
      creditsUsed: 2,
      server: "Server 1"
    },
    {
      id: 4,
      date: "2024-01-14",
      time: "09:23:11",
      service: "Discord",
      number: "+1 555-0126",
      messages: 0,
      status: "expired",
      duration: "15m 00s",
      creditsUsed: 2,
      server: "Server 2"
    },
    {
      id: 5,
      date: "2024-01-13",
      time: "20:11:44",
      service: "Facebook",
      number: "+1 555-0127",
      messages: 1,
      status: "completed",
      duration: "1m 33s",
      creditsUsed: 3,
      server: "Server 1"
    },
    {
      id: 6,
      date: "2024-01-13",
      time: "15:05:17",
      service: "Instagram",
      number: "+1 555-0128",
      messages: 2,
      status: "completed",
      duration: "4m 22s",
      creditsUsed: 3,
      server: "Server 2"
    },
    {
      id: 7,
      date: "2024-01-12",
      time: "11:30:55",
      service: "Twitter",
      number: "+1 555-0129",
      messages: 1,
      status: "cancelled",
      duration: "0m 45s",
      creditsUsed: 0,
      server: "Server 1"
    },
    {
      id: 8,
      date: "2024-01-12",
      time: "08:17:33",
      service: "TikTok",
      number: "+1 555-0130",
      messages: 4,
      status: "completed",
      duration: "7m 11s",
      creditsUsed: 4,
      server: "Server 2"
    }
  ]

  const services = [...new Set(historyData.map(item => item.service))]
  const statuses = [...new Set(historyData.map(item => item.status))]

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

  const filteredData = historyData.filter(item => {
    const matchesSearch = 
      item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.number.includes(searchTerm) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesService = !serviceFilter || item.service === serviceFilter
    const matchesStatus = !statusFilter || item.status === statusFilter
    const matchesDate = !dateFilter || item.date === dateFilter

    return matchesSearch && matchesService && matchesStatus && matchesDate
  })

  const totalSessions = historyData.length
  const completedSessions = historyData.filter(item => item.status === "completed").length
  const totalMessages = historyData.reduce((sum, item) => sum + item.messages, 0)
  const totalCreditsUsed = historyData.reduce((sum, item) => sum + item.creditsUsed, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">SMS History</h1>
          <p className="text-muted-foreground">
            View your complete SMS verification history
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-glow">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
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
              <HistoryIcon className="w-8 h-8 text-primary" />
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
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-info">{totalMessages}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credits Used</p>
                <p className="text-2xl font-bold text-warning">{totalCreditsUsed}</p>
              </div>
              <Calendar className="w-8 h-8 text-warning" />
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
                placeholder="Search..."
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
            
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Session History ({filteredData.length} results)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.date}</div>
                        <div className="text-sm text-muted-foreground">{item.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getServiceIcon(item.service)}</span>
                        <span className="font-medium">{item.service}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm">{item.number}</code>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.messages} received
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.duration}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(item.status) as any}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold">
                      {item.creditsUsed}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <HistoryIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No sessions found matching your filters</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default History