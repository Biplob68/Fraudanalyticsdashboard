import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Save, Play, Plus, Trash2, ArrowRight, Info, FileText, Code, X } from "lucide-react";
import { ruleLibraryItems } from "../data/ruleManagementData";

type LogicalOperator = "AND" | "OR" | "FOLLOWED_BY";
type ActionType = "BLOCK" | "ALERT" | "CASE";

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
  timeWindow?: string;
}

export function RuleBuilder() {
  const { ruleId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(ruleId);
  
  // Find existing rule if editing
  const existingRule = isEditMode ? ruleLibraryItems.find(r => r.id === ruleId) : null;
  
  const [ruleName, setRuleName] = useState(existingRule?.name || "");
  const [category, setCategory] = useState(existingRule?.category || "Velocity");
  const [description, setDescription] = useState(existingRule?.description || "");
  const [conditions, setConditions] = useState<Condition[]>([
    { id: "1", field: "transaction_count", operator: ">", value: "5", timeWindow: "within 1 minute" }
  ]);
  const [logicalOperator, setLogicalOperator] = useState<LogicalOperator>("AND");
  const [actionType, setActionType] = useState<ActionType>("BLOCK");
  
  // Rule Scope with multi-select
  const [applyToAllNetworks, setApplyToAllNetworks] = useState(true);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  
  const [applyToAllAccessChannels, setApplyToAllAccessChannels] = useState(true);
  const [selectedAccessChannels, setSelectedAccessChannels] = useState<string[]>([]);
  
  const [applyToAllTransactionTypes, setApplyToAllTransactionTypes] = useState(true);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
  
  // View JSON modal state
  const [showJsonModal, setShowJsonModal] = useState(false);

  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: "transaction_amount",
      operator: ">",
      value: "1000",
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleSaveToSandbox = () => {
    alert(`Rule "${ruleName}" saved to Sandbox for testing`);
  };

  const handleRunSimulation = () => {
    navigate(`/rule-simulation?ruleName=${encodeURIComponent(ruleName)}`);
  };

  const handleViewJson = () => {
    setShowJsonModal(true);
  };

  const handleCloseJsonModal = () => {
    setShowJsonModal(false);
  };

  // Multi-select handlers
  const toggleNetwork = (network: string) => {
    if (selectedNetworks.includes(network)) {
      setSelectedNetworks(selectedNetworks.filter(n => n !== network));
    } else {
      setSelectedNetworks([...selectedNetworks, network]);
      setApplyToAllNetworks(false);
    }
  };

  const toggleAccessChannel = (channel: string) => {
    if (selectedAccessChannels.includes(channel)) {
      setSelectedAccessChannels(selectedAccessChannels.filter(c => c !== channel));
    } else {
      setSelectedAccessChannels([...selectedAccessChannels, channel]);
      setApplyToAllAccessChannels(false);
    }
  };

  const toggleTransactionType = (type: string) => {
    if (selectedTransactionTypes.includes(type)) {
      setSelectedTransactionTypes(selectedTransactionTypes.filter(t => t !== type));
    } else {
      setSelectedTransactionTypes([...selectedTransactionTypes, type]);
      setApplyToAllTransactionTypes(false);
    }
  };

  const handleApplyToAllNetworks = (checked: boolean) => {
    setApplyToAllNetworks(checked);
    if (checked) {
      setSelectedNetworks([]);
    }
  };

  const handleApplyToAllAccessChannels = (checked: boolean) => {
    setApplyToAllAccessChannels(checked);
    if (checked) {
      setSelectedAccessChannels([]);
    }
  };

  const handleApplyToAllTransactionTypes = (checked: boolean) => {
    setApplyToAllTransactionTypes(checked);
    if (checked) {
      setSelectedTransactionTypes([]);
    }
  };

  const getRuleJson = () => {
    return JSON.stringify({
      ruleName,
      category,
      description,
      conditions,
      logicalOperator,
      actionType,
      scope: {
        networks: applyToAllNetworks ? "ALL" : selectedNetworks,
        accessChannels: applyToAllAccessChannels ? "ALL" : selectedAccessChannels,
        transactionTypes: applyToAllTransactionTypes ? "ALL" : selectedTransactionTypes,
      }
    }, null, 2);
  };

  // Generate human-readable summary
  const generateHumanReadableSummary = () => {
    const networkText = applyToAllNetworks 
      ? "all card networks" 
      : selectedNetworks.length > 0
        ? selectedNetworks.join(" and ")
        : "no networks";
    
    const accessText = applyToAllAccessChannels 
      ? "all access channels" 
      : selectedAccessChannels.length > 0
        ? selectedAccessChannels.join(" and ")
        : "no access channels";
    
    const typeText = applyToAllTransactionTypes 
      ? "all transaction types" 
      : selectedTransactionTypes.length > 0
        ? selectedTransactionTypes.join(" and ")
        : "no transaction types";
    
    const conditionText = conditions.map((c) => {
      const timeText = c.timeWindow ? ` ${c.timeWindow}` : "";
      return `${c.field} ${c.operator} ${c.value}${timeText}`;
    }).join(` ${logicalOperator} `);

    return `This rule applies to ${networkText} on ${accessText} for ${typeText}. It triggers when: ${conditionText}. Final Action: ${actionType}.`;
  };

  const formatScopeDisplay = (applyToAll: boolean, selected: string[]) => {
    if (applyToAll) {
      return "Applies to all values";
    }
    if (selected.length === 0) {
      return "None selected";
    }
    return selected.join(", ");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? `Edit Rule: ${ruleName}` : "Create New Rule"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Build fraud detection rules using visual components
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunSimulation}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Play className="h-4 w-4" />
            Run Simulation
          </button>
          <button
            onClick={handleViewJson}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <FileText className="h-4 w-4" />
            View JSON
          </button>
          <button
            onClick={handleSaveToSandbox}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <Save className="h-4 w-4" />
            Save to Sandbox
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel: Rule Components */}
        <div className="col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              Rule Components
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                  Transaction Fields
                </p>
                <div className="space-y-1 text-sm">
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    transaction_amount
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    transaction_count
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    country_code
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    mcc_code
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    device_fingerprint
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    ip_address
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    vpn_detected
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    failed_attempts
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                  Operators
                </p>
                <div className="space-y-1 text-sm">
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    &gt; (greater than)
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    = (equals)
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    IN (in list)
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    NOT_IN (not in list)
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                  Time Windows
                </p>
                <div className="space-y-1 text-sm">
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    within 1 minute
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    within 5 minutes
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    within 30 minutes
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-gray-700 cursor-move hover:bg-gray-100">
                    within 24 hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: Rule Canvas */}
        <div className="col-span-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Rule Configuration</h3>
            
            {/* Section A: Basic Info */}
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Name *
                </label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., High Velocity Transaction Check"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Velocity">Velocity</option>
                    <option value="Geography">Geography</option>
                    <option value="MCC">MCC</option>
                    <option value="Amount">Amount</option>
                    <option value="Device">Device</option>
                    <option value="Network">Network</option>
                    <option value="Behavior">Behavior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action Type *
                  </label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as ActionType)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="BLOCK">BLOCK</option>
                    <option value="ALERT">ALERT</option>
                    <option value="CASE">CASE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gray Divider */}
            <div className="border-t border-gray-200 mb-5"></div>

            {/* Section B: Rule Scope */}
            <div className="space-y-4 mb-5">
              {/* Channel (Card Network) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Channel (Card Network)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyToAllNetworks}
                      onChange={(e) => handleApplyToAllNetworks(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Apply to All</span>
                  </label>
                </div>
                {applyToAllNetworks ? (
                  <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm text-gray-600">
                    Applies to all values
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {["VISA", "Mastercard", "AMEX"].map((network) => (
                        <button
                          key={network}
                          onClick={() => toggleNetwork(network)}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                            selectedNetworks.includes(network)
                              ? "bg-blue-100 text-blue-700 border border-blue-300"
                              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {network}
                        </button>
                      ))}
                    </div>
                    {selectedNetworks.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedNetworks.map((network) => (
                          <span
                            key={network}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                          >
                            {network}
                            <button
                              onClick={() => toggleNetwork(network)}
                              className="hover:bg-blue-700 rounded"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Access Channel */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Access Channel
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyToAllAccessChannels}
                      onChange={(e) => handleApplyToAllAccessChannels(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Apply to All</span>
                  </label>
                </div>
                {applyToAllAccessChannels ? (
                  <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm text-gray-600">
                    Applies to all values
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {["POS", "ECOM", "ATM", "MOBILE"].map((channel) => (
                        <button
                          key={channel}
                          onClick={() => toggleAccessChannel(channel)}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                            selectedAccessChannels.includes(channel)
                              ? "bg-blue-100 text-blue-700 border border-blue-300"
                              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {channel}
                        </button>
                      ))}
                    </div>
                    {selectedAccessChannels.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedAccessChannels.map((channel) => (
                          <span
                            key={channel}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                          >
                            {channel}
                            <button
                              onClick={() => toggleAccessChannel(channel)}
                              className="hover:bg-blue-700 rounded"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Transaction Type */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Transaction Type
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyToAllTransactionTypes}
                      onChange={(e) => handleApplyToAllTransactionTypes(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Apply to All</span>
                  </label>
                </div>
                {applyToAllTransactionTypes ? (
                  <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm text-gray-600">
                    Applies to all values
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {["Purchase", "Withdrawal", "Refund"].map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleTransactionType(type)}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                            selectedTransactionTypes.includes(type)
                              ? "bg-blue-100 text-blue-700 border border-blue-300"
                              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    {selectedTransactionTypes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedTransactionTypes.map((type) => (
                          <span
                            key={type}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                          >
                            {type}
                            <button
                              onClick={() => toggleTransactionType(type)}
                              className="hover:bg-blue-700 rounded"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Gray Divider */}
            <div className="border-t border-gray-200 mb-5"></div>

            {/* Section C: Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Describe what this rule detects..."
              />
            </div>

            {/* Rule Logic Builder */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Rule Conditions</h4>
                <button
                  onClick={addCondition}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Add Condition
                </button>
              </div>

              <div className="space-y-3">
                {conditions.map((condition, index) => (
                  <div key={condition.id}>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="grid grid-cols-12 gap-3 items-start">
                        <div className="col-span-4">
                          <label className="block text-xs text-gray-600 mb-1">Field</label>
                          <select
                            value={condition.field}
                            onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="transaction_amount">transaction_amount</option>
                            <option value="transaction_count">transaction_count</option>
                            <option value="country_code">country_code</option>
                            <option value="mcc_code">mcc_code</option>
                            <option value="device_fingerprint">device_fingerprint</option>
                            <option value="vpn_detected">vpn_detected</option>
                            <option value="failed_attempts">failed_attempts</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Operator</label>
                          <select
                            value={condition.operator}
                            onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value="=">=</option>
                            <option value="!=">!=</option>
                            <option value="IN">IN</option>
                            <option value="NOT_IN">NOT_IN</option>
                          </select>
                        </div>
                        <div className="col-span-3">
                          <label className="block text-xs text-gray-600 mb-1">Value</label>
                          <input
                            type="text"
                            value={condition.value}
                            onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Time</label>
                          <input
                            type="text"
                            value={condition.timeWindow || ""}
                            onChange={(e) => updateCondition(condition.id, { timeWindow: e.target.value })}
                            placeholder="optional"
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div className="col-span-1 flex items-end">
                          <button
                            onClick={() => removeCondition(condition.id)}
                            className="text-red-600 hover:text-red-800 p-1.5"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {index < conditions.length - 1 && (
                      <div className="flex items-center justify-center py-2">
                        <select
                          value={logicalOperator}
                          onChange={(e) => setLogicalOperator(e.target.value as LogicalOperator)}
                          className="border border-orange-300 bg-orange-50 text-orange-800 rounded px-3 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                          <option value="FOLLOWED_BY">FOLLOWED_BY</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    THEN Action = <span className="font-bold">{actionType}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Rule Summary */}
        <div className="col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-8 space-y-5">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Rule Summary
              </h3>
              
              {/* Human-Readable Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {generateHumanReadableSummary()}
                </p>
              </div>

              {/* Structured Summary */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Rule Scope
                  </p>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>
                        <span className="font-medium">Channel:</span>{" "}
                        {formatScopeDisplay(applyToAllNetworks, selectedNetworks)}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>
                        <span className="font-medium">Access Channel:</span>{" "}
                        {formatScopeDisplay(applyToAllAccessChannels, selectedAccessChannels)}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>
                        <span className="font-medium">Transaction Type:</span>{" "}
                        {formatScopeDisplay(applyToAllTransactionTypes, selectedTransactionTypes)}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Conditions
                  </p>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    {conditions.map((c) => (
                      <li key={c.id} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>
                          {c.field} {c.operator} {c.value}
                          {c.timeWindow && (
                            <span className="text-gray-500"> ({c.timeWindow})</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {conditions.length > 1 && (
                    <p className="text-xs text-gray-600 mt-2 ml-5">
                      <span className="font-medium">Logic:</span> {logicalOperator}
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Action
                  </p>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-bold ${
                      actionType === "BLOCK" ? "bg-red-100 text-red-700" :
                      actionType === "ALERT" ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {actionType}
                    </span>
                  </div>
                </div>
              </div>

              {/* View JSON Button */}
              <button
                onClick={handleViewJson}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                <Code className="h-4 w-4" />
                View JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Rule JSON</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-y-auto h-96">
              <code className="text-sm">
                {getRuleJson()}
              </code>
            </pre>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseJsonModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
