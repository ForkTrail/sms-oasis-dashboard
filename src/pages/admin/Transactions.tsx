import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    async function fetchTransactions() {
      const { data, error } = await supabase.from("transactions").select("id, user_id, amount, status, created_at");
      if (!error && data) setTransactions(data);
    }
    fetchTransactions();
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <div className="grid gap-4">
        {transactions.map(tx => (
          <Card key={tx.id}>
            <CardHeader><CardTitle>Transaction #{tx.id}</CardTitle></CardHeader>
            <CardContent>
              <div>User ID: {tx.user_id}</div>
              <div>Amount: ₦{tx.amount}</div>
              <div>Status: {tx.status}</div>
              <div>Date: {new Date(tx.created_at).toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
