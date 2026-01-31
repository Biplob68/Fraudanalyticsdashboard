import {
  X,
  Shield,
  Activity,
  TrendingUp,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { Rule, ruleKPIs } from "../data/ruleData";

interface RuleDetailDrawerProps {
  rule: Rule;
  onClose: () => void;
}

export function RuleDetailDrawer({
  rule,
  onClose,
}: RuleDetailDrawerProps) {
  const getFPColor = (rate: number) => {
    if (rate < 5) return "text-green-600";
    if (rate <= 10) return "text-yellow-600";
    return "text-red-600";
  };

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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Rule Details
            </h2>
            <p className="text-sm text-gray-600 font-mono">
              {rule.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Section A: Rule Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Rule Summary
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Rule ID</p>
                <p className="text-sm font-medium text-gray-900 font-mono">
                  {rule.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Rule Name
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {rule.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Description
                </p>
                <p className="text-sm text-gray-900">
                  {rule.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Active Since
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {rule.activeSince}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Category
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {rule.category}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Action Type
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    rule.actionType === "BLOCK"
                      ? "bg-red-100 text-red-800"
                      : rule.actionType === "ALERT"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {rule.actionType}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Active Channels
                </p>
                <div className="flex flex-wrap gap-2">
                  {rule.channels.map((channel, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rule Configuration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Rule Logic (Read-Only)
            </h3>
            <div className="bg-gray-900 rounded-lg p-5 font-mono text-sm">
              <div className="text-green-400 mb-3">
                <span className="text-purple-400">IF</span>
              </div>
              {rule.logic.conditions.map((condition, index) => (
                <div key={index} className="ml-4 mb-2">
                  <span className="text-blue-300">
                    {condition.field}
                  </span>{" "}
                  <span className="text-yellow-300">
                    {condition.operator}
                  </span>{" "}
                  <span className="text-green-300">
                    {condition.value}
                  </span>
                  {condition.timeWindow && (
                    <>
                      {" "}
                      <span className="text-gray-400">
                        {condition.timeWindow}
                      </span>
                    </>
                  )}
                  {index < rule.logic.conditions.length - 1 && (
                    <div className="text-orange-400 mt-1">
                      {rule.logic.logicalOperator}
                    </div>
                  )}
                </div>
              ))}
              <div className="text-green-400 mt-3 mb-2">
                <span className="text-purple-400">THEN</span>
              </div>
              <div className="ml-4">
                <span className="text-blue-300">Action</span>
                {" = "}
                <span
                  className={`font-semibold ${
                    rule.actionType === "BLOCK"
                      ? "text-red-400"
                      : rule.actionType === "ALERT"
                        ? "text-yellow-400"
                        : "text-blue-400"
                  }`}
                >
                  {rule.actionType}
                </span>
              </div>
            </div>
          </div>

          {/* Rule Effectiveness */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Effectiveness Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-600 mb-1">
                  True Positives
                </p>
                <p className="text-2xl font-semibold text-green-900">
                  {Math.round(
                    rule.blocks *
                      (1 - rule.falsePositiveRate / 100),
                  ).toLocaleString()}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-red-600 mb-1">
                  False Positives
                </p>
                <p className="text-2xl font-semibold text-red-900">
                  {Math.round(
                    rule.blocks *
                      (rule.falsePositiveRate / 100),
                  ).toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-600 mb-1">
                  Precision
                </p>
                <p className="text-2xl font-semibold text-blue-900">
                  {(100 - rule.falsePositiveRate).toFixed(1)}%
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-purple-600 mb-1">
                  Coverage
                </p>
                <p className="text-2xl font-semibold text-purple-900">
                  {(
                    (rule.hits / ruleKPIs.rulesTriggered) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Recent Activity
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">
                  Last Triggered
                </span>
                <span className="text-sm font-medium text-gray-900">
                  2 minutes ago
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">
                  Triggers (Last Hour)
                </span>
                <span className="text-sm font-medium text-gray-900">
                  47
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">
                  Blocks (Last Hour)
                </span>
                <span className="text-sm font-medium text-gray-900">
                  12
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">
                  Avg Response Time
                </span>
                <span className="text-sm font-medium text-gray-900">
                  45ms
                </span>
              </div>
            </div>
          </div>

          {/* Section D: Actions (Future) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              Rule Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <span className="text-sm font-medium">
                  Edit Rule Configuration
                </span>
                <Settings className="h-4 w-4" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors">
                <span className="text-sm font-medium">
                  Run in Shadow Mode
                </span>
                <AlertTriangle className="h-4 w-4" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <span className="text-sm font-medium">
                  View Triggered Transactions
                </span>
                <Activity className="h-4 w-4" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors">
                <span className="text-sm font-medium">
                  Disable Rule
                </span>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Additional Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Important Note
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  This rule is currently active and monitoring
                  transactions across {rule.channels.length}{" "}
                  channel(s). Any changes to rule parameters
                  will take effect immediately and may impact
                  fraud detection rates.
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}