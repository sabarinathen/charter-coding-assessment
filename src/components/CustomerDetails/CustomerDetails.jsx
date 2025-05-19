import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { calculateRewardsByMonth } from "../../helper/utils";
import { CUSTOMER_DETAILS, MONTHS, YEARS } from "../../helper/constants";
import "../../App.css";

const CustomerDetails = ({ customerId, transactions }) => {
  const [monthlyRewards, setMonthlyRewards] = useState({});
  const [selectedMonthKey, setSelectedMonthKey] = useState("");

  const [filteredTransaction, setFiltered] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("select");
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isFilterDataAvailable, setFilterDataAvailable] = useState(false);

  useMemo(() => {
    setSelectedMonth("select");
    setFilterDataAvailable(false);
    setFiltered({});
    setSelectedMonthKey("");
  }, [customerId]);

  useEffect(() => {
    const userTxns = transactions.filter((t) => t.customerId === customerId);
    const rewardsGrouped = calculateRewardsByMonth(userTxns);
    setMonthlyRewards(rewardsGrouped);
    const firstKey = Object.keys(rewardsGrouped)[0] || "";
    setSelectedMonthKey(firstKey);
  }, [customerId, transactions]);

  useEffect(() => {
    if (isFilterDataAvailable && filteredTransaction) {
      const keys = Object.keys(filteredTransaction);
      if (keys.length > 0) {
        setSelectedMonthKey(keys[0]);
      } else {
        setSelectedMonthKey("");
      }
    }
  }, [filteredTransaction, isFilterDataAvailable]);

  useEffect(() => {
    if (selectedMonth === "select") {
      setFilterDataAvailable(false);
      setFiltered({});
      setSelectedMonthKey("");
      return;
    }

    if (selectedMonth !== null && selectedYear) {
      const filteredMonthData = Object.entries(monthlyRewards).map(
        ([monthKey, data]) => {
          const date = new Date(monthKey);
          return {
            key: monthKey,
            monthKey: date.getMonth(),
            yearKey: date.getFullYear(),
            data,
          };
        }
      );

      const matching = filteredMonthData.filter(
        (item) =>
          item.monthKey === Number(selectedMonth) &&
          item.yearKey === Number(selectedYear)
      );

      const transformed = matching.reduce((acc, item) => {
        acc[item.key] = item.data;
        return acc;
      }, {});

      if (matching.length > 0) {
        setFiltered(transformed);
        setFilterDataAvailable(true);
      } else {
        setFiltered({});
        setFilterDataAvailable(true);
      }
    }
  }, [selectedMonth, selectedYear, monthlyRewards]);

  const totalPoints = Object.values(monthlyRewards).reduce(
    (sum, m) => sum + m.total,
    0
  );

  const getUserName = (id) => {
    const selectedCustomer = transactions.find(
      (item) => item.customerId === id
    );
    return selectedCustomer ? selectedCustomer.name : "Unnamed Customer";
  };

  const displaySource = isFilterDataAvailable
    ? filteredTransaction
    : monthlyRewards;

  const selectedData = displaySource[selectedMonthKey];

  return (
    <div className="customerDetails">
      <div className="bg"></div>
      <h3>
        {CUSTOMER_DETAILS.customerDesc}
        <span className="customerName">{getUserName(customerId)}</span>
        {CUSTOMER_DETAILS.rewards}
      </h3>
      <p>
        <strong>{CUSTOMER_DETAILS.totalPoints}</strong> {totalPoints}
      </p>

      <h4>{CUSTOMER_DETAILS.monthlyReport}</h4>
      <div style={{ marginBottom: "16px" }}>
        <label>
          {CUSTOMER_DETAILS.monthLabel}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          {CUSTOMER_DETAILS.yearLabel}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul>
        {Object.entries(displaySource).map(([monthKey, data]) => (
          <li key={monthKey}>
            <button onClick={() => setSelectedMonthKey(monthKey)}>
              {monthKey} - {data.total} {CUSTOMER_DETAILS.points}
            </button>
          </li>
        ))}
      </ul>

      {selectedMonthKey && (
        <>
          <h4>
            {CUSTOMER_DETAILS.transactionDesc} {selectedMonthKey}
          </h4>
          {selectedData?.transactions?.length > 0 ? (
            <table border="1">
              <thead>
                <tr>
                  <th>{CUSTOMER_DETAILS.date}</th>
                  <th>{CUSTOMER_DETAILS.transactionAmount}</th>
                  <th>{CUSTOMER_DETAILS.earnedPoints}</th>
                </tr>
              </thead>
              <tbody>
                {selectedData.transactions.map((t) => (
                  <tr key={t.transactionId}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>{t.amount}</td>
                    <td>{t.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>{CUSTOMER_DETAILS.noTransaction}</p>
          )}
        </>
      )}
    </div>
  );
};

CustomerDetails.propTypes = {
  customerId: PropTypes.number.isRequired,
  transactions: PropTypes.array.isRequired,
};

export default CustomerDetails;
