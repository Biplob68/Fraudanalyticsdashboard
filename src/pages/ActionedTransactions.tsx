import { useState, useMemo } from "react";
import { Filter, Search, Calendar, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import { transactions, Transaction } from "../data/fraudData";
import { TransactionDetailModal } from "../components/TransactionDetailModal";
import { cases } from "../data/caseData";

export function ActionedTransactions() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    action: "All",
    country: "All",
    channel: "All",
    minAmount: "",
    maxAmount: "",
    dateFrom: "",
    dateTo: "",
    searchQuery: "",
  });

  // Get unique values for filter dropdowns
  const uniqueActions = ["All", ...Array.from(new Set(transactions.map(t => t.action)))];
  const uniqueCountries = ["All", ...Array.from(new Set(transactions.map(t => t.country)))];
  const uniqueChannels = ["All", ...Array.from(new Set(transactions.map(t => t.channel)))];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Action filter
      if (filters.action !== "All" && tx.action !== filters.action) return false;
      
      // Country filter
      if (filters.country !== "All" && tx.country !== filters.country) return false;
      
      // Channel filter
      if (filters.channel !== "All" && tx.channel !== filters.channel) return false;
      
      // Amount range filter
      if (filters.minAmount && tx.amount < parseFloat(filters.minAmount)) return false;
      if (filters.maxAmount && tx.amount > parseFloat(filters.maxAmount)) return false;
      
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          tx.id.toLowerCase().includes(query) ||
          tx.merchant.toLowerCase().includes(query) ||
          tx.country.toLowerCase().includes(query) ||
          tx.cardLast4.includes(query)
        );
      }
      
      return true;
    });
  }, [filters]);

  const handleReset = () => {
    setFilters({
      action: "All",
      country: "All",
      channel: "All",
      minAmount: "",
      maxAmount: "",
      dateFrom: "",
      dateTo: "",
      searchQuery: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Actioned Transactions</h2>
        <p className="text-sm text-gray-600 mt-1">
          View and manage all transactions that have been actioned by the fraud detection system
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel
            </label>
            <select
              value={filters.channel}
              onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {uniqueChannels.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>

          {/* Min Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Amount
            </label>
            <input
              type="number"
              value={filters.minAmount}
              onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Max Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Amount
            </label>
            <input
              type="number"
              value={filters.maxAmount}
              onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
              placeholder="∞"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                placeholder="ID, merchant, card..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset Filters
          </button>
          <div className="flex-1" />
          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Country</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Channel</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Merchant</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tx Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">{tx.time}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                      ${tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{tx.country}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{tx.channel}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{tx.merchant}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{tx.txType}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.action === "Approved"
                            ? "bg-green-100 text-green-800"
                            : tx.action === "Blocked"
                            ? "bg-red-100 text-red-800"
                            : tx.action === "Review"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {tx.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-sm font-semibold ${
                          tx.riskScore >= 80
                            ? "text-red-600"
                            : tx.riskScore >= 50
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {tx.riskScore}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No transactions found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}