import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Settings as SettingsIcon, 
  Palette, 
  Layout, 
  Globe, 
  Bell,
  Shield,
  User,
  Save,
  RefreshCw
} from "lucide-react"

const Settings = () => {
  const [theme, setTheme] = useState("light")
  const [rtlEnabled, setRtlEnabled] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)
  const [sidebarCaptions, setSidebarCaptions] = useState(true)
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6")
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const colorPresets = [
    { name: "Purple", value: "#8B5CF6" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Red", value: "#EF4444" },
    { name: "Orange", value: "#F97316" },
    { name: "Pink", value: "#EC4899" },
  ]

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved")
  }

  const handleReset = () => {
    setTheme("light")
    setRtlEnabled(false)
    setFullWidth(false)
    setSidebarCaptions(true)
    setPrimaryColor("#8B5CF6")
    setNotifications(true)
    setEmailAlerts(true)
    setAutoRefresh(true)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Customize your dashboard experience
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-primary-glow">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Theme Mode</Label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred color scheme
              </p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Primary Color */}
          <div className="space-y-3">
            <div>
              <Label className="text-base font-medium">Primary Color</Label>
              <p className="text-sm text-muted-foreground">
                Customize the main accent color
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setPrimaryColor(color.value)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    primaryColor === color.value 
                      ? 'border-foreground scale-110' 
                      : 'border-border hover:border-foreground/50'
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {primaryColor === color.value && (
                    <div className="w-full h-full rounded-md flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 border rounded-lg cursor-pointer"
                />
                <div className="text-sm">
                  <div className="font-medium">Custom</div>
                  <div className="text-muted-foreground">{primaryColor}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Layout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Enable RTL Layout</Label>
              <p className="text-sm text-muted-foreground">
                Right-to-left text direction for Arabic/Hebrew
              </p>
            </div>
            <Switch checked={rtlEnabled} onCheckedChange={setRtlEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Full-width Container</Label>
              <p className="text-sm text-muted-foreground">
                Use the full width of the screen
              </p>
            </div>
            <Switch checked={fullWidth} onCheckedChange={setFullWidth} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Show Sidebar Captions</Label>
              <p className="text-sm text-muted-foreground">
                Display text labels in the sidebar menu
              </p>
            </div>
            <Switch checked={sidebarCaptions} onCheckedChange={setSidebarCaptions} />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive browser notifications for new SMS
              </p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Email Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get email notifications for important events
              </p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Auto-refresh Messages</Label>
              <p className="text-sm text-muted-foreground">
                Automatically check for new SMS every 5 seconds
              </p>
            </div>
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input defaultValue="john@example.com" type="email" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Language & Region</Label>
            <Select defaultValue="en-us">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-us">English (US)</SelectItem>
                <SelectItem value="en-gb">English (UK)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Badge variant="outline">
              Not Enabled
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              Change Password
            </Button>
            <Button variant="outline">
              Setup 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings