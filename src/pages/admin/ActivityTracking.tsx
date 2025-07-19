import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Filter } from "lucide-react";
import type { Json, Database } from "@/integrations/supabase/types";

// Use the correct enum type for event_type
// Use unknown | null for ip_address
interface Activity {
  id: string;
  created_at: string | null;
  event_type: Database["public"]["Enums"]["log_event_type"];
  user_id: string | null;
  ip_address: unknown | null;
  metadata: Json | null;
}

const ACTION_TYPES: Database["public"]["Enums"]["log_event_type"][] = [
  "sms_request",
  "credit_deduction",
  "credit_addition",
  "payment_processed",
  "user_suspended",
  "session_expired",
  "admin_action"
];

export default function ActivityTracking() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [actionType, setActionType] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    let query = supabase.from("logs").select("id, created_at, event_type, user_id, ip_address, metadata").order("created_at", { ascending: false });
    if (actionType) query = query.eq("event_type", actionType as Database["public"]["Enums"]["log_event_type"]);
    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo) query = query.lte("created_at", dateTo);
    const { data } = await query;
    // Cast ip_address to string for display
    setActivities((data || []).map((a: Activity) => ({ ...a, ip_address: a.ip_address ? String(a.ip_address) : "-" })));
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line
  }, [actionType, dateFrom, dateTo]);

  const handleRefresh = () => fetchActivities();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Filter className="w-8 h-8" /> Activity Tracking
      </h1>
      <div className="mb-4 flex gap-4 items-center">
        <select
          className="border rounded px-3 py-2"
          value={actionType}
          onChange={e => setActionType(e.target.value)}
        >
          <option value="">All Actions</option>
          {ACTION_TYPES.map(type => (
            <option key={type} value={type}>{type.replace(/_/g, " ")}</option>
          ))}
        </select>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
        />
        <span>-</span>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
        />
        <button
          className="ml-4 px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Timestamp</th>
              <th className="p-3 text-left">User Email</th>
              <th className="p-3 text-left">Action Type</th>
              <th className="p-3 text-left">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b">
                <td className="p-3">{activity.created_at ? new Date(activity.created_at).toLocaleString() : "-"}</td>
                <td className="p-3">{activity.user_id ?? "-"}</td>
                <td className="p-3">{activity.event_type.replace(/_/g, " ")}</td>
                <td className="p-3">{String(activity.ip_address ?? "-")}</td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-400">No activity found for selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}