import { X, AlertTriangle, Shield, Clock } from "lucide-react";
import { Transaction } from "../data/fraudData";

interface TransactionDetailModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export function TransactionDetailModal({ transaction, onClose }: TransactionDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
            <p className="text-sm text-gray-600">ID: {transaction.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Transaction Summary
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-sm font-medium text-gray-900">{transaction.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-sm font-medium text-gray-900">${transaction.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Merchant</p>
                <p className="text-sm font-medium text-gray-900">{transaction.merchant}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Card</p>
                <p className="text-sm font-medium text-gray-900">****{transaction.cardLast4}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Country</p>
                <p className="text-sm font-medium text-gray-900">{transaction.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Channel</p>
                <p className="text-sm font-medium text-gray-900">{transaction.channel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Transaction Type</p>
                <p className="text-sm font-medium text-gray-900">{transaction.txType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Risk Score</p>
                <p className={`text-sm font-semibold ${
                  transaction.riskScore >= 80 ? 'text-red-600' :
                  transaction.riskScore >= 50 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {transaction.riskScore}/100
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Action</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                  transaction.action === 'Approved' ? 'bg-green-100 text-green-800' :
                  transaction.action === 'Blocked' ? 'bg-red-100 text-red-800' :
                  transaction.action === 'Review' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.action}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Signals Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Risk Signals
            </h3>
            {transaction.riskSignals.length > 0 ? (
              <div className="space-y-2">
                {transaction.riskSignals.map((signal, index) => (
                  <div key={index} className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-900">{signal}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">No risk signals detected</p>
            )}
          </div>

          {/* Triggered Rules Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Triggered Rules
            </h3>
            {transaction.triggeredRules.length > 0 ? (
              <div className="space-y-2">
                {transaction.triggeredRules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                    <Shield className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-900">{rule}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">No rules triggered</p>
            )}
          </div>

          {/* Analyst Actions Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Analyst Actions
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                    AI
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Automated Decision</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Transaction automatically {transaction.action.toLowerCase()} based on fraud detection rules
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{transaction.time}</p>
                  </div>
                </div>
                {transaction.action === 'Review' && (
                  <div className="flex items-start gap-3 pt-3 border-t border-blue-200">
                    <div className="h-8 w-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                      JD
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Analyst Review Required</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Case assigned to fraud analyst for manual review
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Pending review</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Approve Transaction
            </button>
            <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
              Block Transaction
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
