import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function Configuration() {
  const [settings, setSettings] = useState([]);
  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from("settings").select("key, value, type, description, updated_at");
      if (!error && data) setSettings(data);
    }
    fetchSettings();
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Configuration</h1>
      <div className="grid gap-4">
        {settings.map(setting => (
          <Card key={setting.key}>
            <CardHeader><CardTitle>{setting.key}</CardTitle></CardHeader>
            <CardContent>
              <div>Value: {setting.value}</div>
              <div>Type: {setting.type}</div>
              <div>Description: {setting.description}</div>
              <div>Last Updated: {new Date(setting.updated_at).toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
