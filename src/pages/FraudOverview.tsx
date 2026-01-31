import { 
  TrendingUp, 
  ShieldAlert, 
  Percent, 
  DollarSign,
  Clock
} from "lucide-react";
import { KPICard } from "../components/KPICard";
import { 
  kpiSummary,
  transactionTrendData,
  actionDistributionData,
  blockRateTrendData,
  fraudByChannelData,
  fraudByTxTypeData,
  fraudByCountryData,
  topBlockingRulesData,
  topMCCData,
  fraudDecisionLatencyData,
  transactions
} from "../data/fraudData";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function FraudOverview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Transactions"
          value={kpiSummary.totalTransactions.toLocaleString()}
          icon={TrendingUp}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          trend={{ value: 12.5, isPositive: true }}
        />
        <KPICard
          title="Blocked Transactions"
          value={kpiSummary.blockedTransactions.toLocaleString()}
          icon={ShieldAlert}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          trend={{ value: 8.3, isPositive: false }}
        />
        <KPICard
          title="Block Rate"
          value={`${kpiSummary.blockRate}%`}
          icon={Percent}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
        <KPICard
          title="Blocked Amount"
          value={`$${(kpiSummary.blockedAmount / 1000000).toFixed(2)}M`}
          icon={DollarSign}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transactions vs Blocked Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions vs Blocked Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactionTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Total Transactions"
              />
              <Line 
                type="monotone" 
                dataKey="blocked" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Blocked"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Action Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={actionDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {actionDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Block Rate Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Block Rate Trend (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={blockRateTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Block Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Fraud Decision Latency */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud Decision Latency (ms)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fraudDecisionLatencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="latency" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Latency (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud by Channel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud by Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fraudByChannelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="channel" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="Fraud Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fraud by Transaction Type */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud by Transaction Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fraudByTxTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="txType" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" name="Fraud Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud by Country */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud by Country</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fraudByCountryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="country" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" name="Fraud Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Blocking Rules */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Blocking Rules</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topBlockingRulesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="rule" type="category" stroke="#6b7280" width={150} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" name="Blocks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top MCCs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Blocking MCCs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topMCCData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="mcc" type="category" stroke="#6b7280" width={150} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" name="Blocks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Country</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Channel</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Merchant</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tx Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 8).map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{tx.time}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">${tx.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{tx.country}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{tx.channel}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{tx.merchant}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{tx.txType}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.action === 'Approved' ? 'bg-green-100 text-green-800' :
                      tx.action === 'Blocked' ? 'bg-red-100 text-red-800' :
                      tx.action === 'Review' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}