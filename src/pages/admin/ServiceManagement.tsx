// Lookup table for sms-activate.org service codes to human-readable names
const SERVICE_NAMES: Record<string, string> = {
  tg: "Telegram",
  wa: "WhatsApp",
  fb: "Facebook",
  go: "Google, Gmail, Youtube, Hangouts",
  av: "Avito",
  tw: "Twitter",
  ig: "Instagram",
  ym: "Yahoo, Yandex, Mail.ru",
  vi: "Viber",
  vk: "VKontakte",
  ok: "Odnoklassniki",
  ub: "Uber",
  mb: "Microsoft, Skype, Outlook, Xbox",
  ma: "Mail.ru",
  hw: "Huawei",
  ya: "Yandex",
  mm: "Mamba",
  oi: "OLX",
  we: "WeChat",
  sn: "Snapchat",
  tt: "TikTok",
  po: "Pof.com",
  kt: "KakaoTalk",
  pi: "PayPal, eBay, Amazon",
  am: "Amazon",
  bl: "BlaBlaCar",
  ds: "Discord",
  qi: "QIWI",
  zo: "Zoho",
  ya: "Yandex",
  me: "Mega",
  mt: "Meetup",
  ni: "Nike",
  ot: "Other",
  pt: "ProtonMail",
  ru: "Rambler",
  sy: "Steam",
  te: "Tencent QQ",
  vb: "Viber",
  vv: "Vkontakte",
  wl: "Wildberries",
  yt: "YouTube",
  // ...add more as needed
};
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, ToggleLeft, ToggleRight, Search } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price_per_use: number;
  assigned_server: string;
  stock: number;
  available: boolean;
}

const PAGE_SIZE = 10;

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string>("");

  // Fetch services from Supabase
  const fetchServices = async () => {
    setLoading(true);
    type SupabaseServiceRow = {
      id?: string;
      code?: string;
      name?: string;
      price_per_use?: number;
      assigned_server?: string;
      stock?: number;
      available?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    const { data, error } = await supabase.from("services").select();
    if (error) {
      setToast("Failed to fetch services: " + error.message);
      setServices([]);
    } else if (data) {
      setServices(
        (data as SupabaseServiceRow[]).map((s) => ({
          id: s.id ?? '',
          code: s.code ?? '',
          name: s.name ?? '',
          price_per_use: s.price_per_use ?? 0,
          assigned_server: s.assigned_server ?? '',
          stock: typeof s.stock === 'number' ? s.stock : 0,
          available: !!s.available,
          created_at: s.created_at ?? '',
          updated_at: s.updated_at ?? ''
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Sync services from SMS-Man API
  const syncServices = async () => {
  // Optional: Clear the services table before syncing for a clean slate
   await supabase.from("services").delete().neq('code', '');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/syncServices');
      const apiData = await res.json();

      if (!apiData || typeof apiData !== 'object' || Array.isArray(apiData)) {
        setToast("Failed to sync services: " + (apiData.error_msg || apiData.error || "Unknown error"));
        console.error('Sync error:', apiData);
        setLoading(false);
        setTimeout(() => setToast(""), 3000);
        return;
      }

  // Log all keys from the API response for debugging
  console.log('API service keys:', Object.keys(apiData));
  // Map sms-activate.org v2 getPrices object to array of services, filtering out non-service keys
  const serviceEntries = Object.entries(apiData).filter(([code]) => code !== 'status');
  for (const [code, price] of serviceEntries) {
        await supabase.from("services").upsert({
          code: code,
          name: SERVICE_NAMES[code] || `Unknown Service (${code})`,
          price_per_use: Number(price),
          assigned_server: 'server_1',
          stock: 0, // Not provided by API v2 getPrices
          available: Number(price) > 0
        }, { onConflict: 'code' });
      }
      setToast("Services synced successfully!");
      fetchServices();
    } catch (err) {
      setToast("Failed to sync services.");
      console.error('Sync error:', err);
    }
    setLoading(false);
    setTimeout(() => setToast(""), 3000);
  };

  // Toggle service active/inactive
  const toggleService = async (service: Service) => {
    await supabase.from("services").update({ available: !service.available }).eq("id", service.id);
    fetchServices();
  };

  // Search and paginate
  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.assigned_server.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        Service Management
      </h1>
      <div className="mb-4 flex gap-2 items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="pl-10 pr-4 py-2 rounded border w-full"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"
          onClick={syncServices}
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4" /> Sync Services
        </button>
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Service Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Assigned Server</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Available</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Updated At</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((service) => (
              <tr key={service.id || service.code} className="border-b">
                <td className="p-3">{service.id}</td>
                <td className="p-3">{service.code}</td>
                <td className="p-3">{service.name}</td>
                <td className="p-3">{service.price_per_use}</td>
                <td className="p-3">{service.assigned_server}</td>
                <td className="p-3">{service.stock}</td>
                <td className="p-3">{service.available ? 'Yes' : 'No'}</td>
                <td className="p-3">{service.created_at}</td>
                <td className="p-3">{service.updated_at}</td>
                <td className="p-3">
                  <button
                    className="focus:outline-none"
                    onClick={() => toggleService(service)}
                    title={service.available ? "Deactivate" : "Activate"}
                  >
                    {service.available ? (
                      <ToggleRight className="w-6 h-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center p-6 text-gray-400">No services found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <span>
            Page {page} of {Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 rounded border"
              disabled={page === Math.ceil(filtered.length / PAGE_SIZE)}
              onClick={() => setPage((p) => Math.min(Math.ceil(filtered.length / PAGE_SIZE), p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
