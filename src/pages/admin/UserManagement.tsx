import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Ban, CheckCircle, RefreshCw, Search } from "lucide-react";

interface User {
  id: string;
  email: string;
  status: string | null;
  balance: number | null;
  created_at: string | null;
}

const PAGE_SIZE = 10;

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalUser, setModalUser] = useState<User | null>(null);
  const [modalAction, setModalAction] = useState<"suspend" | "reactivate" | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, email, status, balance, created_at");
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.id && u.id.toLowerCase().includes(search.toLowerCase()))
  );
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSuspend = async (user: User) => {
    await supabase.from("users").update({ status: "suspended" }).eq("id", user.id);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: "suspended" } : u))
    );
    setModalUser(null);
    setModalAction(null);
  };

  const handleReactivate = async (user: User) => {
    await supabase.from("users").update({ status: "active" }).eq("id", user.id);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: "active" } : u))
    );
    setModalUser(null);
    setModalAction(null);
  };

  const handleResetPassword = async (user: User) => {
    // Implement password reset logic here
    alert(`Password reset for ${user.email}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Users className="w-8 h-8" /> User Management
      </h1>
      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="pl-10 pr-4 py-2 rounded border w-full"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Balance</th>
              <th className="p-3 text-left">Registered</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3">{user.balance ?? 0}</td>
                <td className="p-3">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</td>
                <td className="p-3 flex gap-2">
                  {user.status === "active" ? (
                    <button
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
                      onClick={() => {
                        setModalUser(user);
                        setModalAction("suspend");
                      }}
                      title="Suspend"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:bg-green-50 p-2 rounded"
                      onClick={() => {
                        setModalUser(user);
                        setModalAction("reactivate");
                      }}
                      title="Reactivate"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                    onClick={() => handleResetPassword(user)}
                    title="Reset Password"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
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
      {/* Modal Confirmation */}
      {modalUser && modalAction && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalAction === "suspend" ? "Suspend User" : "Reactivate User"}
            </h2>
            <p className="mb-6">
              Are you sure you want to {modalAction} <span className="font-semibold">{modalUser.email}</span>?
            </p>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => {
                  setModalUser(null);
                  setModalAction(null);
                }}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  modalAction === "suspend" ? "bg-red-600 text-white" : "bg-green-600 text-white"
                }`}
                onClick={() =>
                  modalAction === "suspend"
                    ? handleSuspend(modalUser)
                    : handleReactivate(modalUser)
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}