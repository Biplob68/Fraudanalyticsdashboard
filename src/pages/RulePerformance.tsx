import { useState } from "react";
import { 
  Shield, 
  Activity, 
  Percent, 
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { KPICard } from "../components/KPICard";
import {
  ruleKPIs,
  ruleHitsTrendData,
  falsePositiveByRuleData,
  blockedAmountByRuleData,
  rulesByChannelData,
  rulesByMCCData,
  rules,
  Rule
} from "../data/ruleData";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RuleDetailDrawer } from "../components/RuleDetailDrawer";

export function RulePerformance() {
  const [timeRange, setTimeRange] = useState("7d");
  const [actionType, setActionType] = useState("ALL");
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  // Filter rules based on action type
  const filteredRules = actionType === "ALL" 
    ? rules 
    : rules.filter(rule => rule.actionType === actionType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-green-100 text-green-800";
      case "Noisy":
        return "bg-yellow-100 text-yellow-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRowColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-red-50 hover:bg-red-100";
      case "Noisy":
        return "bg-yellow-50 hover:bg-yellow-100";
      default:
        return "hover:bg-gray-50";
    }
  };

  const getFPColor = (rate: number) => {
    if (rate < 5) return "text-green-600";
    if (rate <= 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Breadcrumb and Filters */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <span>Fraud Analytics</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Rule Performance</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Rule Performance</h2>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7d</option>
              <option value="30d">Last 30d</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Action Type</label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="ALL">All Actions</option>
              <option value="BLOCK">BLOCK</option>
              <option value="ALERT">ALERT</option>
              <option value="CASE">CASE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 1: Rule Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Rules"
          value={ruleKPIs.activeRules}
          icon={Shield}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Rules Triggered (Total)"
          value={ruleKPIs.rulesTriggered.toLocaleString()}
          icon={Activity}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <KPICard
          title="Avg Block Rate"
          value={`${ruleKPIs.avgBlockRate}%`}
          icon={Percent}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
        <KPICard
          title="Avg False Positive Rate"
          value={`${ruleKPIs.avgFalsePositiveRate}%`}
          icon={AlertTriangle}
          iconBgColor={
            ruleKPIs.avgFalsePositiveRate < 5 
              ? "bg-green-100" 
              : ruleKPIs.avgFalsePositiveRate <= 10 
              ? "bg-yellow-100" 
              : "bg-red-100"
          }
          iconColor={
            ruleKPIs.avgFalsePositiveRate < 5 
              ? "text-green-600" 
              : ruleKPIs.avgFalsePositiveRate <= 10 
              ? "text-yellow-600" 
              : "text-red-600"
          }
        />
      </div>

      {/* Section 2: Rule Effectiveness Trend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rule Hits vs Blocks (Over Time)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={ruleHitsTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const blockPercent = ((data.blocks / data.hits) * 100).toFixed(1);
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                      <p className="text-sm font-medium text-gray-900">{data.time}</p>
                      <p className="text-sm text-gray-600">Hits: {data.hits}</p>
                      <p className="text-sm text-gray-600">Blocks: {data.blocks}</p>
                      <p className="text-sm font-medium text-blue-600">Block %: {blockPercent}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="hits" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Rule Hits"
            />
            <Line 
              type="monotone" 
              dataKey="blocks" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Blocks"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Section 3: Top Rules Table (CORE) */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Rule Performance Table</h3>
          <p className="text-sm text-gray-600 mt-1">
            Click any row to view detailed rule analytics
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rule ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rule Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hits</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Blocks</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Block %</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">False Positives %</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Blocked Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr
                  key={rule.id}
                  onClick={() => setSelectedRule(rule)}
                  className={`border-b border-gray-100 cursor-pointer transition-colors ${getRowColor(rule.status)}`}
                >
                  <td className="py-3 px-4 text-sm font-mono text-gray-900">{rule.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{rule.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{rule.hits.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{rule.blocks.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{rule.blockRate}%</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-semibold ${getFPColor(rule.falsePositiveRate)}`}>
                      {rule.falsePositiveRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                    ${rule.blockedAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                      {rule.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Rule Quality Visuals (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* False Positive Rate by Rule */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">False Positive Rate by Rule</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={falsePositiveByRuleData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="rule" type="category" stroke="#6b7280" width={150} />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'FP Rate']}
              />
              <Bar 
                dataKey="rate" 
                fill="#ef4444" 
                name="FP Rate %" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Blocked Amount by Rule */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocked Amount by Rule</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={blockedAmountByRuleData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="rule" type="category" stroke="#6b7280" width={150} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Blocked Amount']}
              />
              <Bar 
                dataKey="amount" 
                fill="#10b981" 
                name="Blocked Amount" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 5: Rule Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rules by Channel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rules by Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rulesByChannelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="channel" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="blocks" fill="#8b5cf6" name="Rule Blocks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rules by MCC */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rules by MCC</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rulesByMCCData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="mcc" type="category" stroke="#6b7280" width={150} />
              <Tooltip />
              <Bar dataKey="blocks" fill="#f59e0b" name="Rule Blocks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rule Detail Drawer */}
      {selectedRule && (
        <RuleDetailDrawer
          rule={selectedRule}
          onClose={() => setSelectedRule(null)}
        />
      )}
    </div>
  );
}
