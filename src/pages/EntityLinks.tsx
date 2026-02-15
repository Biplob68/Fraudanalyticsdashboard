import { useState } from "react";
import { 
  Network, 
  CreditCard, 
  Smartphone, 
  Store, 
  Globe, 
  AlertTriangle,
  LayoutList,
  ChevronDown,
  ChevronRight,
  Info
} from "lucide-react";
import { mockEntityInvestigation } from "../data/entityInvestigationData";

type ViewMode = "summary" | "network";
type EntitySection = "device" | "ip" | "merchant" | "card";

const ITEMS_PER_PAGE = 10;

export function EntityLinks() {
  const [viewMode, setViewMode] = useState<ViewMode>("summary");
  const [expandedSections, setExpandedSections] = useState<Set<EntitySection>>(new Set());
  
  // Pagination state for each entity type
  const [currentPages, setCurrentPages] = useState<Record<EntitySection, number>>({
    device: 0,
    ip: 0,
    merchant: 0,
    card: 0,
  });

  const toggleSection = (section: EntitySection) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const getDecisionBadge = (decision: "BLOCK" | "ALERT" | "CASE") => {
    switch (decision) {
      case "BLOCK":
        return "bg-red-100 text-red-700 border-red-300";
      case "ALERT":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "CASE":
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "High Risk":
        return "bg-red-100 text-red-700 border-red-300";
      case "Medium Risk":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Low Risk":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getPaginatedTransactions = (transactions: any[], page: number) => {
    const start = page * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return transactions.slice(start, end);
  };

  const getTotalPages = (total: number) => Math.ceil(total / ITEMS_PER_PAGE);

  const changePage = (section: EntitySection, direction: "prev" | "next", totalPages: number) => {
    setCurrentPages(prev => ({
      ...prev,
      [section]: direction === "prev" 
        ? Math.max(0, prev[section] - 1)
        : Math.min(totalPages - 1, prev[section] + 1)
    }));
  };

  const renderEntitySection = (
    section: EntitySection,
    icon: JSX.Element,
    title: string,
    entityLink: typeof mockEntityInvestigation.deviceLink
  ) => {
    const isExpanded = expandedSections.has(section);
    const currentPage = currentPages[section];
    const paginatedTxns = getPaginatedTransactions(entityLink.transactions, currentPage);
    const totalPages = getTotalPages(entityLink.transactions.length);

    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection(section)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            {icon}
            <div className="text-left">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-gray-900">{title}: {entityLink.entityValue}</h3>
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border ${getRiskLevelBadge(entityLink.summary.riskLevel)}`}>
                  {entityLink.summary.riskLevel}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="font-medium">Total Transactions: {entityLink.summary.totalTransactions}</span>
                <span className="text-red-600 font-medium">BLOCK: {entityLink.summary.blockCount}</span>
                <span className="text-yellow-600 font-medium">ALERT: {entityLink.summary.alertCount}</span>
                <span className="text-blue-600 font-medium">CASE: {entityLink.summary.caseCount}</span>
                <span>•</span>
                <span>Last Activity: {entityLink.summary.lastActivity}</span>
              </div>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6">
            <div className="border-t border-gray-200 pt-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Transaction ID</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Decision</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Amount</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Channel</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Rule Hits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedTxns.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{txn.id}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border ${getDecisionBadge(txn.decision)}`}>
                            {txn.decision}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{txn.amount}</td>
                        <td className="px-4 py-3">{txn.date}</td>
                        <td className="px-4 py-3">{txn.channel}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {txn.ruleHits}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
                <span>
                  Showing {currentPage * ITEMS_PER_PAGE + 1}–{Math.min((currentPage + 1) * ITEMS_PER_PAGE, entityLink.transactions.length)} of {entityLink.transactions.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => changePage(section, "prev", totalPages)}
                    disabled={currentPage === 0}
                    className="px-3 py-1 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => changePage(section, "next", totalPages)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Entity Link Analysis</h1>
            <p className="text-sm text-gray-600 mt-1">
              Investigate transaction bindings across device, IP address, merchant, and card
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("summary")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "summary"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LayoutList className="h-4 w-4" />
              Summary View
            </button>
            <button
              onClick={() => setViewMode("network")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "network"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Network className="h-4 w-4" />
              Network View
            </button>
          </div>
        </div>
      </div>

      {/* Summary View */}
      {viewMode === "summary" && (
        <div className="space-y-6">
          {/* Base Transaction */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Base Transaction
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Transaction ID</p>
                  <p className="text-sm font-medium text-gray-900">{mockEntityInvestigation.baseTransaction.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Decision</p>
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-bold border ${getDecisionBadge(mockEntityInvestigation.baseTransaction.decision)}`}>
                    {mockEntityInvestigation.baseTransaction.decision}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Amount</p>
                  <p className="text-sm font-medium text-gray-900">{mockEntityInvestigation.baseTransaction.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Risk Score</p>
                  <p className="text-lg font-bold text-red-600">{mockEntityInvestigation.baseTransaction.riskScore}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4 pt-3 border-t border-blue-300">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Card ID</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">{mockEntityInvestigation.baseTransaction.cardId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Device ID</p>
                  <p className="text-sm font-medium text-gray-900">{mockEntityInvestigation.baseTransaction.deviceId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">IP Address</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">{mockEntityInvestigation.baseTransaction.ipAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Merchant</p>
                  <p className="text-sm font-medium text-gray-900">{mockEntityInvestigation.baseTransaction.merchantName}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-3 border-t border-blue-300">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Channel (Card Network)</p>
                  <p className="text-sm font-medium text-gray-900">{mockEntityInvestigation.baseTransaction.channel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Access Channel</p>
                  <p className="text-sm font-medium text-gray-900">{mockEntityInvestigation.baseTransaction.accessChannel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Transaction Type</p>
                  <p className="text-sm font-medium text-gray-900">{mockEntityInvestigation.baseTransaction.transactionType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Timestamp</p>
                  <p className="text-sm font-medium text-gray-900">{mockEntityInvestigation.baseTransaction.timestamp}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related by Device */}
          {renderEntitySection(
            "device",
            <Smartphone className="h-5 w-5 text-purple-600" />,
            "Related by Device",
            mockEntityInvestigation.deviceLink
          )}

          {/* Related by IP Address */}
          {renderEntitySection(
            "ip",
            <Globe className="h-5 w-5 text-red-600" />,
            "Related by IP Address",
            mockEntityInvestigation.ipLink
          )}

          {/* Related by Merchant */}
          {renderEntitySection(
            "merchant",
            <Store className="h-5 w-5 text-green-600" />,
            "Related by Merchant",
            mockEntityInvestigation.merchantLink
          )}

          {/* Related by Card */}
          {renderEntitySection(
            "card",
            <CreditCard className="h-5 w-5 text-blue-600" />,
            "Related by Card",
            mockEntityInvestigation.cardLink
          )}
        </div>
      )}

      {/* Network View */}
      {viewMode === "network" && (
        <div>
          {/* Banner */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900 font-medium">
                  Network visualization is exploratory. Use Summary View for detailed investigation.
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Displays one transaction binding to one device, one IP, one merchant, and one card. Limited to 20 nodes for performance.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-600" />
                Entity Network Graph
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  High Risk
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                  Medium Risk
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  Low Risk
                </div>
              </div>
            </div>

            {/* Visual Graph Representation */}
            <div className="bg-gray-50 rounded-lg p-8 min-h-[500px] relative">
              {/* Center: Base Transaction */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">BASE TRANSACTION</p>
                  <div className="p-4 rounded-lg border-4 border-blue-600 bg-blue-100 shadow-lg">
                    <CreditCard className="h-8 w-8 text-red-600 mx-auto" />
                    <p className="text-sm mt-2 font-mono font-bold">{mockEntityInvestigation.baseTransaction.id}</p>
                    <p className="text-xs text-gray-600 mt-1">{mockEntityInvestigation.baseTransaction.amount}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border mt-2 ${getDecisionBadge(mockEntityInvestigation.baseTransaction.decision)}`}>
                      {mockEntityInvestigation.baseTransaction.decision}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top: Device */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <p className="text-xs text-gray-500 mb-2 font-semibold text-center">DEVICE</p>
                <div className="p-3 rounded-lg border-2 border-purple-600 bg-white shadow-md text-center">
                  <Smartphone className="h-6 w-6 text-purple-600 mx-auto" />
                  <p className="text-xs mt-2 font-medium">{mockEntityInvestigation.deviceLink.entityValue}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border mt-1 ${getRiskLevelBadge(mockEntityInvestigation.deviceLink.summary.riskLevel)}`}>
                    {mockEntityInvestigation.deviceLink.summary.riskLevel}
                  </span>
                </div>
              </div>

              {/* Right: Merchant */}
              <div className="absolute top-1/2 right-8 -translate-y-1/2">
                <p className="text-xs text-gray-500 mb-2 font-semibold">MERCHANT</p>
                <div className="p-3 rounded-lg border-2 border-green-600 bg-white shadow-md">
                  <Store className="h-6 w-6 text-green-600 mx-auto" />
                  <p className="text-xs mt-2 font-medium">{mockEntityInvestigation.merchantLink.entityValue}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border mt-1 ${getRiskLevelBadge(mockEntityInvestigation.merchantLink.summary.riskLevel)}`}>
                    {mockEntityInvestigation.merchantLink.summary.riskLevel}
                  </span>
                </div>
              </div>

              {/* Bottom: Card */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <p className="text-xs text-gray-500 mb-2 font-semibold text-center">CARD</p>
                <div className="p-3 rounded-lg border-2 border-blue-600 bg-white shadow-md text-center">
                  <CreditCard className="h-6 w-6 text-blue-600 mx-auto" />
                  <p className="text-xs mt-2 font-medium font-mono">{mockEntityInvestigation.cardLink.entityValue}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border mt-1 ${getRiskLevelBadge(mockEntityInvestigation.cardLink.summary.riskLevel)}`}>
                    {mockEntityInvestigation.cardLink.summary.riskLevel}
                  </span>
                </div>
              </div>

              {/* Left: IP */}
              <div className="absolute top-1/2 left-8 -translate-y-1/2">
                <p className="text-xs text-gray-500 mb-2 font-semibold">IP ADDRESS</p>
                <div className="p-3 rounded-lg border-2 border-red-600 bg-white shadow-md">
                  <Globe className="h-6 w-6 text-red-600 mx-auto" />
                  <p className="text-xs mt-2 font-medium font-mono">{mockEntityInvestigation.ipLink.entityValue}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border mt-1 ${getRiskLevelBadge(mockEntityInvestigation.ipLink.summary.riskLevel)}`}>
                    {mockEntityInvestigation.ipLink.summary.riskLevel}
                  </span>
                </div>
              </div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 pointer-events-none">
                {/* Device to Transaction */}
                <line
                  x1="50%"
                  y1="50%"
                  x2="50%"
                  y2="15%"
                  stroke="#9333ea"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
                {/* Merchant to Transaction */}
                <line
                  x1="50%"
                  y1="50%"
                  x2="85%"
                  y2="50%"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
                {/* Card to Transaction */}
                <line
                  x1="50%"
                  y1="50%"
                  x2="50%"
                  y2="85%"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
                {/* IP to Transaction */}
                <line
                  x1="50%"
                  y1="50%"
                  x2="15%"
                  y2="50%"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              </svg>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900">
                <strong>Transaction-Centric Binding:</strong> One transaction connects to exactly one device, one IP address, one merchant, and one card. Each entity node shows aggregated metrics for all transactions involving that entity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
