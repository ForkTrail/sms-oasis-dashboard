import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import GetNumber from "./pages/GetNumber";
import LiveSMS from "./pages/LiveSMS";
import PurchaseCredits from "./pages/PurchaseCredits";
import History from "./pages/History";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ActivityTracking from "./pages/admin/ActivityTracking";
import ServiceManagement from "./pages/admin/ServiceManagement";
import Transactions from "./pages/admin/Transactions";
import SystemLogs from "./pages/admin/SystemLogs";
import Configuration from "./pages/admin/Configuration";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/get-number" element={<DashboardLayout><GetNumber /></DashboardLayout>} />
          <Route path="/live-sms" element={<DashboardLayout><LiveSMS /></DashboardLayout>} />
          <Route path="/purchase-credits" element={<DashboardLayout><PurchaseCredits /></DashboardLayout>} />
          <Route path="/history" element={<DashboardLayout><History /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
          <Route path="/admin" element={<DashboardLayout isAdmin><AdminDashboard /></DashboardLayout>} />
          <Route path="/admin/users" element={<DashboardLayout isAdmin><UserManagement /></DashboardLayout>} />
          <Route path="/admin/activity" element={<DashboardLayout isAdmin><ActivityTracking /></DashboardLayout>} />
          <Route path="/admin/services" element={<DashboardLayout isAdmin><ServiceManagement /></DashboardLayout>} />
          <Route path="/admin/transactions" element={<DashboardLayout isAdmin><Transactions /></DashboardLayout>} />
          <Route path="/admin/logs" element={<DashboardLayout isAdmin><SystemLogs /></DashboardLayout>} />
          <Route path="/admin/config" element={<DashboardLayout isAdmin><Configuration /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
