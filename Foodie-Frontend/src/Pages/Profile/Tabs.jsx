import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <ul className="nav nav-tabs mb-4" role="tablist">
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === "basicInfo" ? "active text-info" : ""}`}
          onClick={() => setActiveTab("basicInfo")}
        >
          <i className="fa fa-id-badge me-2"></i>Basic Info
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === "orderHistory" ? "active text-info" : ""}`}
          onClick={() => setActiveTab("orderHistory")}
        >
          <i className="fa fa-history me-2"></i>Order History
        </button>
      </li>
    </ul>
  );
};

export default Tabs;
