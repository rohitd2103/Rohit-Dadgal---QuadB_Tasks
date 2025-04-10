import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { MODULE_ADDRESS } from "@/constants";

export function useRefund() {
  const { account, signAndSubmitTransaction } = useWallet();

  const storeRefundData = async (amount: number) => {
    if (!account) return;
    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::Refund::store_refund_data`,
      type_arguments: [],
      arguments: [amount],
    };

    const tx = await signAndSubmitTransaction({ sender: account.address, data: payload });
    await aptosClient.waitForTransaction(tx.hash);
    return tx.hash;
  };

  const deleteRefundData = async () => {
    if (!account) return;
    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::Refund::delete_refund_data`,
      type_arguments: [],
      arguments: [],
    };

    const tx = await signAndSubmitTransaction({ sender: account.address, data: payload });
    await aptosClient.waitForTransaction(tx.hash);
    return tx.hash;
  };

  return { storeRefundData, deleteRefundData };
}
