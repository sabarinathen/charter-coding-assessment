import React, { useState } from "react";
import PropTypes from "prop-types";

import "../../App.css";
import { CUSTOMER_LIST } from "../../helper/constants";

const CustomerList = ({ customers, onSelect, transactions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(customers.length / pageSize);
  const paginated = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (delta) => {
    setCurrentPage((prev) => Math.max(1, Math.min(prev + delta, totalPages)));
  };

  const getUserName = (id) => {
    const selectedCustomer = transactions.find(
      (item) => item.customerId === id
    );
    return selectedCustomer ? selectedCustomer.name : "Unnamed Customer";
  };

  return (
    <div className="customerList">
      <h3>{CUSTOMER_LIST.customerHeading}</h3>
      <ul>
        {paginated.map((c) => (
          <li key={c.customerId}>
            <button onClick={() => onSelect(c.customerId)}>
              {getUserName(c.customerId)}
            </button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 1}
        >
          {CUSTOMER_LIST.next}
        </button>
        {`${CUSTOMER_LIST.page} ${currentPage} ${CUSTOMER_LIST.of} ${totalPages}`}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === totalPages}
        >
          {CUSTOMER_LIST.next}
        </button>
      </div>
    </div>
  );
};

CustomerList.propTypes = {
  customers: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  transactions: PropTypes.array.isRequired,
};

export default CustomerList;
