import React, { useEffect, useState } from "react";

import { fetchTransactions } from "../../helper/api/transactionService";
import { logEvent } from "../../helper/utils/logger";
import CustomerList from "../CustomerList/customerList";
import CustomerDetails from "../CustomerDetails/CustomerDetails";
import { DASHBOARD_CONSTANTS } from "../../helper/constants";

import "../../App.css";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCustomerDetails = async () => {
    setLoading(true);
    try {
      const transactionData = await fetchTransactions();
      console.log(transactionData);
      setTransactions(transactionData);
    } catch (error) {
      logEvent("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomerDetails();
  }, []);

  const customers = Array.from(
    new Set(transactions.map((t) => t.customerId))
  ).map((id) => ({ customerId: id }));

  if (loading) return <p>{DASHBOARD_CONSTANTS.loading}</p>;

  return (
    <div className="dashboardContainer">
      <CustomerList
        customers={customers}
        transactions={transactions}
        onSelect={setSelectedCustomer}
      />
      {selectedCustomer && (
        <CustomerDetails
          customerId={selectedCustomer}
          transactions={transactions}
        />
      )}
    </div>
  );
};

export default Dashboard;
