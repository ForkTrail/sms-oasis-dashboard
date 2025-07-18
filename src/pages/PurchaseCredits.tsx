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
import { 
  CreditCard, 
  Zap, 
  Star, 
  Gift, 
  TrendingUp,
  DollarSign,
  Shield,
  CheckCircle
} from "lucide-react"

const PurchaseCredits = () => {
  const [selectedPackage, setSelectedPackage] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const currentBalance = 45

  const packages = [
    {
      id: "starter",
      name: "Starter Pack",
      credits: 30,
      price: 600,
      currency: "₦",
      popular: false,
      bonus: 0,
      features: ["Basic SMS verification", "Standard support", "7-day validity"]
    },
    {
      id: "popular",
      name: "Popular Pack",
      credits: 75,
      price: 1400,
      currency: "₦",
      popular: true,
      bonus: 5,
      features: ["Priority SMS delivery", "24/7 support", "15-day validity", "5 bonus credits"]
    },
    {
      id: "premium",
      name: "Premium Pack",
      credits: 150,
      price: 2600,
      currency: "₦",
      popular: false,
      bonus: 15,
      features: ["Premium servers", "Instant delivery", "30-day validity", "15 bonus credits"]
    },
    {
      id: "enterprise",
      name: "Enterprise Pack",
      credits: 300,
      price: 4800,
      currency: "₦",
      popular: false,
      bonus: 50,
      features: ["Dedicated support", "API access", "60-day validity", "50 bonus credits"]
    }
  ]

  const paymentMethods = [
    { value: "card", label: "Credit/Debit Card", icon: "💳" },
    { value: "paystack", label: "Paystack", icon: "🔷" },
    { value: "flutterwave", label: "Flutterwave", icon: "🟡" },
    { value: "bank", label: "Bank Transfer", icon: "🏦" },
  ]

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Purchase Credits</h1>
        <p className="text-muted-foreground">
          Choose the perfect credit package for your SMS verification needs
        </p>
      </div>

      {/* Current Balance */}
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

      {/* Package Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedPackage === pkg.id 
                ? 'ring-2 ring-primary border-primary shadow-lg' 
                : 'hover:border-primary/50'
            } ${pkg.popular ? 'border-primary' : ''}`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-primary-glow">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">
                  {pkg.currency}{pkg.price.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  for {pkg.credits} credits
                  {pkg.bonus > 0 && (
                    <span className="text-success ml-1">
                      +{pkg.bonus} bonus
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {pkg.credits + pkg.bonus}
                </div>
                <div className="text-xs text-muted-foreground">Total Credits</div>
              </div>
              
              <div className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <div className="text-xs text-muted-foreground">
                  {pkg.currency}{(pkg.price / (pkg.credits + pkg.bonus)).toFixed(2)} per credit
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Details */}
      {selectedPackage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center gap-2">
                        <span>{method.icon}</span>
                        <span>{method.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="bg-gradient-to-r from-success/5 to-success/10 border-success/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPkg && (
                <>
                  <div className="flex justify-between items-center">
                    <span>Package:</span>
                    <span className="font-medium">{selectedPkg.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Base Credits:</span>
                    <span className="font-medium">{selectedPkg.credits}</span>
                  </div>
                  
                  {selectedPkg.bonus > 0 && (
                    <div className="flex justify-between items-center text-success">
                      <span>Bonus Credits:</span>
                      <span className="font-medium">+{selectedPkg.bonus}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Credits:</span>
                      <span className="text-primary">
                        {selectedPkg.credits + selectedPkg.bonus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Amount to Pay:</span>
                      <span className="text-primary">
                        {selectedPkg.currency}{selectedPkg.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Checkout Button */}
      {selectedPackage && selectedPkg && (
        <Card>
          <CardContent className="p-6">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-lg py-6"
              disabled={!paymentMethod}
            >
              <Zap className="w-5 h-5 mr-2" />
              Complete Purchase - {selectedPkg.currency}{selectedPkg.price.toLocaleString()}
            </Button>
            
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Secure Payment
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Instant Delivery
              </div>
              <div className="flex items-center gap-1">
                <Gift className="w-4 h-4" />
                Bonus Credits
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="text-center">
          <CardContent className="p-6">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Instant Activation</h3>
            <p className="text-sm text-muted-foreground">
              Credits are added to your account immediately after payment
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">
              All transactions are encrypted and protected by industry standards
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Bonus Credits</h3>
            <p className="text-sm text-muted-foreground">
              Get extra credits with larger packages for better value
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PurchaseCredits