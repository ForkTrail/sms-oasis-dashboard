import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Smartphone, 
  Copy, 
  RefreshCw, 
  X, 
  Clock, 
  MessageSquare, 
  CheckCircle,
  Phone
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const LiveSMS = () => {
  const { toast } = useToast()
  const [timeLeft, setTimeLeft] = useState(890) // 14 minutes 50 seconds
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "Google",
      content: "Your verification code is: 847392",
      timestamp: "2024-01-15 14:32:15",
      code: "847392"
    },
    {
      id: 2,
      from: "Google",
      content: "Your Google Account verification code is 847392. Don't share this code with anyone.",
      timestamp: "2024-01-15 14:32:10",
      code: "847392"
    }
  ])

  const sessionData = {
    number: "+1 (555) 123-4567",
    service: "Google",
    server: "Server 1",
    status: "active",
    startTime: "14:17:25",
    creditsUsed: 2
  }

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate new messages
  useEffect(() => {
    const messageTimer = setInterval(() => {
      // Randomly add new messages (demo)
      if (Math.random() > 0.95) {
        const newMessage = {
          id: messages.length + 1,
          from: sessionData.service,
          content: `Your verification code is: ${Math.floor(100000 + Math.random() * 900000)}`,
          timestamp: new Date().toLocaleString(),
          code: `${Math.floor(100000 + Math.random() * 900000)}`
        }
        setMessages(prev => [newMessage, ...prev])
      }
    }, 5000)

    return () => clearInterval(messageTimer)
  }, [messages.length, sessionData.service])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    })
  }

  const refreshMessages = () => {
    toast({
      title: "Refreshing...",
      description: "Checking for new messages",
    })
  }

  const cancelSession = () => {
    toast({
      title: "Session Cancelled",
      description: "Your session has been terminated",
      variant: "destructive"
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Live SMS Session</h1>
        <p className="text-muted-foreground">
          Monitor incoming SMS messages in real-time
        </p>
      </div>

      {/* Session Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Phone Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-background/50 p-3 rounded-lg">
                <span className="text-2xl font-mono font-bold">{sessionData.number}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(sessionData.number)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Service:</span>
                  <div className="font-medium">{sessionData.service}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Server:</span>
                  <div className="font-medium">{sessionData.server}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-warning/5 to-warning/10 border-warning/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Session Timer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-warning">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-sm text-muted-foreground">Time remaining</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <div className="font-medium">{sessionData.startTime}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default" className="font-medium">
                    {sessionData.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant="outline"
              onClick={() => copyToClipboard(sessionData.number)}
              className="flex-1 sm:flex-none"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Number
            </Button>
            
            <Button 
              variant="outline"
              onClick={refreshMessages}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Messages
            </Button>
            
            <Button 
              variant="destructive"
              onClick={cancelSession}
              className="flex-1 sm:flex-none"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages Panel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Incoming Messages ({messages.length})
          </CardTitle>
          <Badge variant="outline" className="animate-pulse">
            <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
            Live
          </Badge>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No messages received yet...</p>
              <p className="text-sm">Messages will appear here automatically</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className="border rounded-lg p-4 hover:bg-muted/30 transition-colors animate-fade-in"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="font-medium">{message.from}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {message.timestamp}
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-lg mb-3">
                    <p className="text-sm">{message.content}</p>
                  </div>
                  
                  {message.code && (
                    <div className="flex items-center justify-between bg-primary/5 p-2 rounded border border-primary/20">
                      <span className="text-xs text-muted-foreground">Verification Code:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary text-lg">
                          {message.code}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(message.code)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Stats */}
      <Card className="bg-gradient-to-r from-muted/30 to-muted/10">
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Credits Used:</span>
            <span className="font-medium">{sessionData.creditsUsed} credits</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LiveSMS