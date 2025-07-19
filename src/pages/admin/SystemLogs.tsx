import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase.from("logs").select("id, description, created_at, ip_address");
      if (!error && data) setLogs(data);
    }
    fetchLogs();
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">System Logs</h1>
      <div className="grid gap-4">
        {logs.map(log => (
          <Card key={log.id}>
            <CardHeader><CardTitle>Log #{log.id}</CardTitle></CardHeader>
            <CardContent>
              <div>{log.description}</div>
              <div>IP: {log.ip_address}</div>
              <div>Date: {new Date(log.created_at).toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
