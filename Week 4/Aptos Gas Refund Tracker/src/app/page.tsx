// app/page.tsx (or pages/index.tsx depending on your structure)
import RefundForm from "@/components/RefundForm";

export default function Home() {
  return (
    <main>
      <h1 className="text-xl font-bold text-center mt-4">Aptos Gas Refund Demo</h1>
      <RefundForm />
    </main>
  );
}
