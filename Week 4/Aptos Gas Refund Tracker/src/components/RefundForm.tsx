// components/RefundForm.tsx
"use client";

import { useState } from "react";

export default function RefundForm() {
  const [beforeGas, setBeforeGas] = useState<number | null>(null);
  const [afterGas, setAfterGas] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTransact = async () => {
    setLoading(true);
    setBeforeGas(null);
    setAfterGas(null);

    try {
      const response = await fetch("/api/transact", {
        method: "POST",
      });

      const data = await response.json();
      setBeforeGas(data.beforeGas);
      setAfterGas(data.afterGas);
    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-md shadow-md max-w-md mx-auto">
      <button
        onClick={handleTransact}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Processing..." : "Transact"}
      </button>

      {beforeGas !== null && afterGas !== null && (
        <div className="mt-4">
          <p>Gas used before deletion: <strong>{beforeGas}</strong></p>
          <p>Gas used after deletion: <strong>{afterGas}</strong></p>
        </div>
      )}
    </div>
  );
}
