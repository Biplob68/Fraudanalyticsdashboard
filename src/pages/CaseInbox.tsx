import { useState } from "react";
import { Link } from "react-router";
import { Filter, ExternalLink, AlertCircle } from "lucide-react";
import { cases, caseKPIs, CaseStatus, RiskLevel } from "../data/caseData";

export function CaseInbox() {
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "ALL">("ALL");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [analystFilter, setAnalystFilter] = useState<string>("ALL");

  const filteredCases = cases.filter((c) => {
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (riskFilter !== "ALL" && c.riskLevel !== riskFilter) return false;
    if (analystFilter !== "ALL" && c.assignedAnalyst !== analystFilter) return false;
    return true;
  });

  const uniqueAnalysts = Array.from(new Set(cases.map(c => c.assignedAnalyst)));

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "CRITICAL":
        return "bg-red-600 text-white";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "UNDER_REVIEW":
        return "bg-purple-100 text-purple-800";
      case "CONFIRMED_FRAUD":
        return "bg-red-100 text-red-800";
      case "FALSE_POSITIVE":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskIcon = (risk: RiskLevel) => {
    if (risk === "CRITICAL" || risk === "HIGH") {
      return <AlertCircle className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Case Inbox</h1>
        <p className="text-sm text-gray-600 mt-1">
          Review and investigate fraud cases generated from flagged transactions
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-7 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Cases</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {caseKPIs.totalCases}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Open</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">
            {caseKPIs.openCases}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Under Review</p>
          <p className="text-2xl font-semibold text-purple-600 mt-1">
            {caseKPIs.underReview}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Confirmed Fraud</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">
            {caseKPIs.confirmedFraud}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">False Positives</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {caseKPIs.falsePositives}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Closed</p>
          <p className="text-2xl font-semibold text-gray-600 mt-1">
            {caseKPIs.closedCases}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Avg Resolution</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {caseKPIs.avgResolutionTime}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CaseStatus | "ALL")}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CONFIRMED_FRAUD">Confirmed Fraud</option>
            <option value="FALSE_POSITIVE">False Positive</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskLevel | "ALL")}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select
            value={analystFilter}
            onChange={(e) => setAnalystFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">All Analysts</option>
            {uniqueAnalysts.map((analyst) => (
              <option key={analyst} value={analyst}>{analyst}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Case ID
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Transaction ID
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Risk Level
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Assigned Analyst
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Channel
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Created
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCases.map((caseItem) => (
                <tr 
                  key={caseItem.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    caseItem.riskLevel === "CRITICAL" ? "bg-red-50" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getRiskIcon(caseItem.riskLevel)}
                      <span className="text-sm font-mono text-gray-900">{caseItem.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono text-gray-600">{caseItem.transactionId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(caseItem.riskLevel)}`}>
                      {caseItem.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">{caseItem.assignedAnalyst}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-medium text-gray-900">
                      ${caseItem.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{caseItem.channel}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{caseItem.createdAt}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      to={`/case-detail/${caseItem.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No cases match the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
