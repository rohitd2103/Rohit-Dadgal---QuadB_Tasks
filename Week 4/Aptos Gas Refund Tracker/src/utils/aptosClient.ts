import { AptosClient } from "aptos";
import { NETWORK } from "@/constants";

export const aptosClient = new AptosClient(`https://fullnode.${NETWORK}.aptoslabs.com/v1`);
