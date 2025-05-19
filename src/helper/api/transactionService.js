import { logEvent } from "../utils/logger";

export const fetchTransactions = async () => {
  try {
    const response = await fetch("/data/transactions.json");
    if (!response.ok) throw new Error("Failed to fetch transactions");
    const data = await response.json();
    logEvent("Transactions fetched:", data)
    return data;
  } catch (error) {
    logEvent("Fetch error:", error)
    throw error;
  }
};