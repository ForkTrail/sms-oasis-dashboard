import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Smartphone, Globe, Server, DollarSign, Zap, Shield } from "lucide-react"

const GetNumber = () => {
  const [selectedService, setSelectedService] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedServer, setSelectedServer] = useState("server1")

  const services = [
    { value: "google", label: "Google", price: 2, icon: "🔍" },
    { value: "whatsapp", label: "WhatsApp", price: 3, icon: "💬" },
    { value: "telegram", label: "Telegram", price: 2, icon: "✈️" },
    { value: "discord", label: "Discord", price: 2, icon: "🎮" },
    { value: "facebook", label: "Facebook", price: 3, icon: "📘" },
    { value: "instagram", label: "Instagram", price: 3, icon: "📷" },
    { value: "twitter", label: "Twitter", price: 2, icon: "🐦" },
    { value: "tiktok", label: "TikTok", price: 4, icon: "🎵" },
  ]

  const countries = [
    { value: "us", label: "United States", flag: "🇺🇸", multiplier: 1.0 },
    { value: "uk", label: "United Kingdom", flag: "🇬🇧", multiplier: 1.2 },
    { value: "ca", label: "Canada", flag: "🇨🇦", multiplier: 1.1 },
    { value: "au", label: "Australia", flag: "🇦🇺", multiplier: 1.3 },
    { value: "de", label: "Germany", flag: "🇩🇪", multiplier: 1.4 },
    { value: "fr", label: "France", flag: "🇫🇷", multiplier: 1.4 },
    { value: "nl", label: "Netherlands", flag: "🇳🇱", multiplier: 1.5 },
    { value: "in", label: "India", flag: "🇮🇳", multiplier: 0.5 },
  ]

  const servers = [
    { 
      value: "server1", 
      label: "Server 1", 
      status: "online", 
      load: 23, 
      speed: "Fast",
      reliability: "99.8%"
    },
    { 
      value: "server2", 
      label: "Server 2", 
      status: "online", 
      load: 67, 
      speed: "Normal",
      reliability: "99.5%"
    },
  ]

  const calculatePrice = () => {
    if (!selectedService || !selectedCountry) return 0
    
    const service = services.find(s => s.value === selectedService)
    const country = countries.find(c => c.value === selectedCountry)
    
    if (!service || !country) return 0
    
    return Math.ceil(service.price * country.multiplier)
  }

  const currentBalance = 45 // Demo balance

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Get Temporary Phone Number</h1>
        <p className="text-muted-foreground">
          Request a temporary number for OTP verification across various services
        </p>
      </div>

      {/* Balance Display */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="font-medium">Current Balance:</span>
          </div>
          <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
            {currentBalance} Credits
          </Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Select Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    <div className="flex items-center gap-2">
                      <span>{service.icon}</span>
                      <span>{service.label}</span>
                      <Badge variant="outline" className="ml-auto">
                        {service.price} credits
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Country Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Select Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.label}</span>
                      <Badge variant="outline" className="ml-auto">
                        x{country.multiplier}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Server Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Select Server
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedServer} onValueChange={setSelectedServer}>
              {servers.map((server) => (
                <div key={server.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/30">
                  <RadioGroupItem value={server.value} id={server.value} />
                  <Label htmlFor={server.value} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{server.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {server.speed} • {server.reliability} uptime
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant={server.status === "online" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {server.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {server.load}% load
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Summary */}
      <Card className="bg-gradient-to-r from-success/5 to-success/10 border-success/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Base Price:</span>
              <span className="font-medium">
                {selectedService ? services.find(s => s.value === selectedService)?.price || 0 : 0} credits
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Country Multiplier:</span>
              <span className="font-medium">
                x{selectedCountry ? countries.find(c => c.value === selectedCountry)?.multiplier || 1 : 1}
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Cost:</span>
                <span className="text-primary">{calculatePrice()} credits</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Card>
        <CardContent className="p-6">
          <Button 
            className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-lg py-6"
            disabled={!selectedService || !selectedCountry || calculatePrice() > currentBalance}
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Number - {calculatePrice()} Credits
          </Button>
          
          {calculatePrice() > currentBalance && (
            <p className="text-center text-destructive text-sm mt-2">
              Insufficient credits. You need {calculatePrice() - currentBalance} more credits.
            </p>
          )}
          
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Secure & Private
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Instant Delivery
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GetNumber