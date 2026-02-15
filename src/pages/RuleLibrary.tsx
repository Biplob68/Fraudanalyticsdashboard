import { useState } from "react";
import { Link } from "react-router";
import { Plus, Filter, BookOpen, Edit, Play, Workflow } from "lucide-react";
import { ruleLibraryItems, ruleLibraryKPIs, RuleStatus, RuleCategory } from "../data/ruleManagementData";

export function RuleLibrary() {
  const [statusFilter, setStatusFilter] = useState<RuleStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<RuleCategory | "ALL">("ALL");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");

  const filteredRules = ruleLibraryItems.filter((rule) => {
    if (statusFilter !== "ALL" && rule.status !== statusFilter) return false;
    if (categoryFilter !== "ALL" && rule.category !== categoryFilter) return false;
    if (channelFilter !== "ALL" && !rule.channels.includes(channelFilter)) return false;
    return true;
  });

  const getStatusColor = (status: RuleStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "SANDBOX":
        return "bg-yellow-100 text-yellow-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFPColor = (rate: number) => {
    if (rate < 5) return "text-green-600";
    if (rate <= 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Rule Library</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage and monitor all fraud detection rules
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Rules</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {ruleLibraryKPIs.totalRules}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {ruleLibraryKPIs.activeRules}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Sandbox</p>
          <p className="text-2xl font-semibold text-yellow-600 mt-1">
            {ruleLibraryKPIs.sandboxRules}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-semibold text-gray-600 mt-1">
            {ruleLibraryKPIs.inactiveRules}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Avg FP Rate</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {ruleLibraryKPIs.avgFalsePositiveRate}%
          </p>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RuleStatus | "ALL")}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SANDBOX">Sandbox</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as RuleCategory | "ALL")}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Velocity">Velocity</option>
              <option value="Geography">Geography</option>
              <option value="MCC">MCC</option>
              <option value="Amount">Amount</option>
              <option value="Device">Device</option>
              <option value="Network">Network</option>
              <option value="Behavior">Behavior</option>
            </select>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="ALL">All Channels</option>
              <option value="Online">Online</option>
              <option value="Mobile">Mobile</option>
              <option value="POS">POS</option>
              <option value="ATM">ATM</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/visual-rule-builder"
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <Workflow className="h-4 w-4" />
              Visual Builder
            </Link>
            <Link
              to="/rule-builder"
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Create New Rule
            </Link>
            <Link
              to="/rule-templates"
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <BookOpen className="h-4 w-4" />
              View Templates
            </Link>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Rule ID
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Rule Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Hits
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Blocks
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  FP Rate
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Last Modified
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono text-gray-900">{rule.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{rule.name}</p>
                      <p className="text-xs text-gray-500">{rule.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {rule.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(rule.status)}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-gray-900">
                      {rule.hits.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-gray-900">
                      {rule.blocks.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium ${getFPColor(rule.falsePositiveRate)}`}>
                      {rule.falsePositiveRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{rule.lastModified}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/rule-builder/${rule.id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit Rule"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/rule-simulation?ruleId=${rule.id}`}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Run Simulation"
                      >
                        <Play className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No rules match the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
}