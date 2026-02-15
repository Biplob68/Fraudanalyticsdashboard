import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Save,
  Play,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  Code,
  History,
  Send,
  Shield,
  X,
  FileText,
  GripVertical,
  Clock,
  Zap,
} from "lucide-react";
import { ruleLibraryItems } from "../data/ruleManagementData";

// Types
type LogicOperator = "AND" | "OR" | "FOLLOWED_BY";
type ActionType = "ALERT" | "CASE" | "BLOCK";
type Severity = "Low" | "Medium" | "High";
type RuleStatus = "Draft" | "Sandbox" | "Active";

interface RuleCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  timeWindow?: string;
}

interface LogicGroup {
  id: string;
  type: LogicOperator;
  conditions: (RuleCondition | LogicGroup)[];
  collapsed?: boolean;
}

// Draggable Component Library Item
interface DraggableComponentProps {
  name: string;
  type: "field" | "operator" | "timeWindow" | "logic";
  description?: string;
}

function DraggableComponent({ name, type, description }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { name, componentType: type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const bgColor =
    type === "logic"
      ? "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100";

  return (
    <div
      ref={drag}
      className={`p-2.5 border rounded-md text-sm cursor-move transition-all ${bgColor} ${
        isDragging ? "opacity-50 scale-95" : "hover:shadow-sm"
      }`}
      title={description}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-3.5 w-3.5 opacity-40" />
        <span className="font-medium">{name}</span>
      </div>
    </div>
  );
}

// Time Window Preset Buttons
interface TimeWindowPresetsProps {
  value?: string;
  onChange: (value: string) => void;
}

function TimeWindowPresets({ value, onChange }: TimeWindowPresetsProps) {
  const presets = [
    { label: "1m", value: "1m" },
    { label: "5m", value: "5m" },
    { label: "1h", value: "1h" },
    { label: "24h", value: "24h" },
    { label: "7d", value: "7d" },
  ];

  return (
    <div className="flex items-center gap-1">
      {presets.map((preset) => (
        <button
          key={preset.value}
          onClick={() => onChange(preset.value)}
          className={`px-2 py-1 text-xs rounded border transition-all ${
            value === preset.value
              ? "bg-blue-600 text-white border-blue-600 font-semibold"
              : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

// Condition Block Component
interface ConditionBlockProps {
  condition: RuleCondition;
  onUpdate: (updates: Partial<RuleCondition>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

function ConditionBlock({ condition, onUpdate, onRemove, onDuplicate }: ConditionBlockProps) {
  // Determine if this field needs a time window
  const needsTimeWindow = [
    "transaction_count",
    "declined_count",
    "amount_sum",
    "device_txn_count",
    "ip_txn_count",
  ].includes(condition.field);

  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg p-4 hover:border-blue-300 transition-all shadow-sm hover:shadow">
      <div className="space-y-3">
        {/* Main Condition Row */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Field
            </label>
            <select
              value={condition.field}
              onChange={(e) => onUpdate({ field: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <optgroup label="Transaction Attributes">
                <option value="transaction_amount">Amount</option>
                <option value="currency">Currency</option>
                <option value="country_code">Country</option>
                <option value="mcc_code">MCC Code</option>
                <option value="merchant_name">Merchant Name</option>
                <option value="channel">Channel</option>
                <option value="is_on_us">Is On-Us</option>
              </optgroup>
              <optgroup label="Behavioral / Velocity">
                <option value="transaction_count">Transaction Count</option>
                <option value="declined_count">Declined Count</option>
                <option value="amount_sum">Amount Sum</option>
                <option value="device_txn_count">Device Txn Count</option>
                <option value="ip_txn_count">IP Txn Count</option>
              </optgroup>
              <optgroup label="Profile-Based">
                <option value="avg_daily_spend">Avg Daily Spend</option>
                <option value="customer_risk_tier">Risk Tier</option>
                <option value="card_age_days">Card Age</option>
                <option value="new_device_flag">New Device Flag</option>
              </optgroup>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Operator
            </label>
            <select
              value={condition.operator}
              onChange={(e) => onUpdate({ operator: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="==">==</option>
              <option value="!=">!=</option>
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value=">=">&gt;=</option>
              <option value="<=">&lt;=</option>
              <option value="IN">IN</option>
              <option value="NOT_IN">NOT IN</option>
              <option value="BETWEEN">BETWEEN</option>
              <option value="CONTAINS">CONTAINS</option>
            </select>
          </div>
          <div className="col-span-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Value
            </label>
            <input
              type="text"
              value={condition.value}
              onChange={(e) => onUpdate({ value: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter value"
            />
          </div>
          <div className="col-span-2 flex items-end justify-end gap-1">
            <button
              onClick={onDuplicate}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Duplicate Condition"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={onRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Remove Condition"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Time Window Row (if needed) */}
        {needsTimeWindow && (
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Time Window
                </label>
                <TimeWindowPresets
                  value={condition.timeWindow}
                  onChange={(val) => onUpdate({ timeWindow: val })}
                />
              </div>
              {condition.timeWindow && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  <Clock className="h-3 w-3" />
                  within {condition.timeWindow}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Logic Separator Component
interface LogicSeparatorProps {
  type: LogicOperator;
  onChange: (type: LogicOperator) => void;
}

function LogicSeparator({ type, onChange }: LogicSeparatorProps) {
  const colors = {
    AND: "bg-blue-100 text-blue-700 border-blue-300",
    OR: "bg-purple-100 text-purple-700 border-purple-300",
    FOLLOWED_BY: "bg-orange-100 text-orange-700 border-orange-300",
  };

  return (
    <div className="flex items-center justify-center py-3">
      <select
        value={type}
        onChange={(e) => onChange(e.target.value as LogicOperator)}
        className={`px-4 py-2 border-2 rounded-lg text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors[type]} hover:shadow-md transition-all cursor-pointer`}
      >
        <option value="AND">AND</option>
        <option value="OR">OR</option>
        <option value="FOLLOWED_BY">FOLLOWED BY</option>
      </select>
    </div>
  );
}

// Simulation Modal
interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ruleName: string;
}

function SimulationModal({ isOpen, onClose, ruleName }: SimulationModalProps) {
  const [testData, setTestData] = useState({
    amount: "2500",
    country: "RU",
    channel: "ECOM",
    mcc: "5812",
    transactionCount: "8",
    declinedCount: "3",
  });

  const [result, setResult] = useState<{
    triggered: boolean;
    matchedConditions: string[];
    action: string;
    decision: string;
    explanation: string;
  } | null>(null);

  const runSimulation = () => {
    // Mock simulation
    const triggered = parseInt(testData.transactionCount) > 5;
    setResult({
      triggered,
      matchedConditions: triggered
        ? ["transaction_count > 5", "country_code == RU"]
        : [],
      action: triggered ? "BLOCK" : "ALLOW",
      decision: triggered ? "DECLINE" : "APPROVE",
      explanation: triggered
        ? "Transaction blocked due to high velocity from high-risk country"
        : "Transaction approved - no rule violations detected",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Rule Simulation</h2>
            <p className="text-sm text-gray-600 mt-1">{ruleName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-6">
          {/* Left: Test Inputs */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Test Transaction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Amount
                </label>
                <input
                  type="number"
                  value={testData.amount}
                  onChange={(e) => setTestData({ ...testData, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Country Code
                </label>
                <input
                  type="text"
                  value={testData.country}
                  onChange={(e) => setTestData({ ...testData, country: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Channel
                </label>
                <select
                  value={testData.channel}
                  onChange={(e) => setTestData({ ...testData, channel: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="POS">POS</option>
                  <option value="ECOM">ECOM</option>
                  <option value="ATM">ATM</option>
                  <option value="MOBILE">MOBILE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  MCC Code
                </label>
                <input
                  type="text"
                  value={testData.mcc}
                  onChange={(e) => setTestData({ ...testData, mcc: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Transaction Count (1h)
                </label>
                <input
                  type="number"
                  value={testData.transactionCount}
                  onChange={(e) =>
                    setTestData({ ...testData, transactionCount: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Declined Count (1h)
                </label>
                <input
                  type="number"
                  value={testData.declinedCount}
                  onChange={(e) =>
                    setTestData({ ...testData, declinedCount: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={runSimulation}
                className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow"
              >
                Run Simulation
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Simulation Result</h3>
            {result ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg border-2 ${
                    result.triggered
                      ? "bg-red-50 border-red-300"
                      : "bg-green-50 border-green-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.triggered ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <span
                      className={`font-semibold ${
                        result.triggered ? "text-red-900" : "text-green-900"
                      }`}
                    >
                      {result.triggered ? "Rule Triggered" : "Rule Not Triggered"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{result.explanation}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Matched Conditions
                  </h4>
                  {result.matchedConditions.length > 0 ? (
                    <ul className="space-y-1">
                      {result.matchedConditions.map((condition, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
                            {condition}
                          </code>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No conditions matched</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Action Taken</p>
                    <p className="font-semibold text-gray-900">{result.action}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Final Decision</p>
                    <p className="font-semibold text-gray-900">{result.decision}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Run simulation to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Visual Rule Builder Component
export function VisualRuleBuilder() {
  const { ruleId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(ruleId);

  // Find existing rule if editing
  const existingRule = isEditMode
    ? ruleLibraryItems.find((r) => r.id === ruleId)
    : null;

  // State
  const [ruleName, setRuleName] = useState(
    existingRule?.name || "High Velocity Transaction Check"
  );
  const [ruleIdState] = useState(ruleId || `RULE-${Date.now().toString().slice(-6)}`);
  const [category, setCategory] = useState(existingRule?.category || "Velocity");
  const [status, setStatus] = useState<RuleStatus>("Draft");
  const [version] = useState("v1.0");
  const [channel, setChannel] = useState("ANY");
  const [transactionType, setTransactionType] = useState("ANY");

  const [conditions, setConditions] = useState<RuleCondition[]>([
    {
      id: "1",
      field: "transaction_count",
      operator: ">",
      value: "5",
      timeWindow: "1h",
    },
  ]);

  const [logicOperator, setLogicOperator] = useState<LogicOperator>("AND");
  const [actionType, setActionType] = useState<ActionType>("BLOCK");
  const [severity, setSeverity] = useState<Severity>("High");
  const [alertMessage, setAlertMessage] = useState(
    "High velocity transaction detected from customer"
  );

  const [showSimulation, setShowSimulation] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);

  // Handlers
  const addCondition = useCallback(() => {
    const newCondition: RuleCondition = {
      id: Date.now().toString(),
      field: "transaction_amount",
      operator: ">",
      value: "1000",
    };
    setConditions([...conditions, newCondition]);
  }, [conditions]);

  const removeCondition = useCallback(
    (id: string) => {
      setConditions(conditions.filter((c) => c.id !== id));
    },
    [conditions]
  );

  const updateCondition = useCallback(
    (id: string, updates: Partial<RuleCondition>) => {
      setConditions(conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    },
    [conditions]
  );

  const duplicateCondition = useCallback(
    (id: string) => {
      const condition = conditions.find((c) => c.id === id);
      if (condition) {
        const duplicate = { ...condition, id: Date.now().toString() };
        const index = conditions.findIndex((c) => c.id === id);
        setConditions([
          ...conditions.slice(0, index + 1),
          duplicate,
          ...conditions.slice(index + 1),
        ]);
      }
    },
    [conditions]
  );

  const generateNaturalLanguage = () => {
    if (conditions.length === 0) return "No conditions defined yet.";

    const conditionTexts = conditions.map((c) => {
      const fieldLabel = c.field.replace(/_/g, " ");
      const timeWindowText = c.timeWindow ? ` within ${c.timeWindow}` : "";
      return `${fieldLabel} ${c.operator} ${c.value}${timeWindowText}`;
    });

    const logic = conditions.length > 1 ? ` ${logicOperator} ` : "";
    return `When ${conditionTexts.join(logic)}, then ${actionType.toLowerCase()} the transaction with ${severity.toLowerCase()} severity.`;
  };

  const handleValidate = () => {
    alert("✓ Rule validation passed. No syntax errors detected.");
  };

  const handleSaveDraft = () => {
    alert(`Rule "${ruleName}" saved as draft`);
  };

  const handleSaveToSandbox = () => {
    setStatus("Sandbox");
    alert(`Rule "${ruleName}" saved to Sandbox environment`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Sticky Header - Improved */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="text-2xl font-bold text-gray-900 border-0 border-b-2 border-transparent hover:border-gray-300 focus:border-red-500 focus:outline-none bg-transparent px-0 py-1"
                  placeholder="Rule Name"
                />
                <span
                  className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                    status === "Active"
                      ? "bg-green-100 text-green-700"
                      : status === "Sandbox"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {status}
                </span>
                <span className="text-xs text-gray-500 font-medium">{version}</span>
              </div>
              <div className="text-sm text-gray-600 font-mono">{ruleIdState}</div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Category:</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="Velocity">Velocity</option>
                  <option value="Geo">Geo</option>
                  <option value="MCC">MCC</option>
                  <option value="Amount">Amount</option>
                  <option value="Behavioral">Behavioral</option>
                </select>
              </div>
              <div className="h-5 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Channel:</span>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="POS">POS</option>
                  <option value="ECOM">ECOM</option>
                  <option value="ATM">ATM</option>
                  <option value="ANY">ANY</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Transaction Type:</span>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="Purchase">Purchase</option>
                  <option value="Withdrawal">Withdrawal</option>
                  <option value="Refund">Refund</option>
                  <option value="ANY">ANY</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* LEFT PANEL - Component Library */}
            <div className="col-span-3">
              <div className="sticky top-40 space-y-5">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Component Library</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    <GripVertical className="h-3 w-3" />
                    Drag components to canvas
                  </p>

                  {/* Transaction Attributes */}
                  <div className="mb-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Transaction Attributes
                    </p>
                    <div className="space-y-2">
                      <DraggableComponent
                        name="Amount"
                        type="field"
                        description="Transaction amount"
                      />
                      <DraggableComponent name="Currency" type="field" />
                      <DraggableComponent name="Country" type="field" />
                      <DraggableComponent name="Channel" type="field" />
                      <DraggableComponent name="MCC" type="field" />
                      <DraggableComponent name="Merchant Name" type="field" />
                      <DraggableComponent name="Is On-Us" type="field" />
                    </div>
                  </div>

                  {/* Behavioral / Velocity */}
                  <div className="mb-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Behavioral / Velocity
                    </p>
                    <div className="space-y-2">
                      <DraggableComponent
                        name="Transaction Count"
                        type="field"
                        description="Requires time window"
                      />
                      <DraggableComponent
                        name="Declined Count"
                        type="field"
                        description="Requires time window"
                      />
                      <DraggableComponent
                        name="Amount Sum"
                        type="field"
                        description="Requires time window"
                      />
                      <DraggableComponent name="Device Txn Count" type="field" />
                      <DraggableComponent name="IP Txn Count" type="field" />
                    </div>
                  </div>

                  {/* Profile-Based */}
                  <div className="mb-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Profile-Based
                    </p>
                    <div className="space-y-2">
                      <DraggableComponent name="Avg Daily Spend" type="field" />
                      <DraggableComponent name="Customer Risk Tier" type="field" />
                      <DraggableComponent name="Card Age" type="field" />
                      <DraggableComponent name="New Device Flag" type="field" />
                    </div>
                  </div>

                  {/* Logic Blocks */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Logic Blocks
                    </p>
                    <div className="space-y-2">
                      <DraggableComponent name="AND" type="logic" />
                      <DraggableComponent name="OR" type="logic" />
                      <DraggableComponent name="FOLLOWED BY" type="logic" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER CANVAS - Rule Builder */}
            <div className="col-span-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-6 text-lg">Rule Flow Builder</h3>

                {/* IF Statement */}
                <div className="mb-5">
                  <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm">
                    <Zap className="h-4 w-4" />
                    IF
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-4 mb-6">
                  {conditions.map((condition, index) => (
                    <div key={condition.id}>
                      <ConditionBlock
                        condition={condition}
                        onUpdate={(updates) => updateCondition(condition.id, updates)}
                        onRemove={() => removeCondition(condition.id)}
                        onDuplicate={() => duplicateCondition(condition.id)}
                      />
                      {index < conditions.length - 1 && (
                        <LogicSeparator
                          type={logicOperator}
                          onChange={setLogicOperator}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Condition Button */}
                <button
                  onClick={addCondition}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Add Condition
                </button>

                {/* THEN Statement - Improved Visual Separation */}
                <div className="mt-8 mb-5 border-t-2 border-gray-200 pt-8">
                  <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm">
                    <Zap className="h-4 w-4" />
                    THEN
                  </div>
                </div>

                {/* Action Configuration - Improved */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Action Configuration
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {(["ALERT", "CASE", "BLOCK"] as ActionType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setActionType(type)}
                        className={`p-4 rounded-lg border-2 font-bold text-sm transition-all ${
                          actionType === type
                            ? type === "BLOCK"
                              ? "bg-red-600 text-white border-red-600 shadow-md"
                              : type === "ALERT"
                              ? "bg-yellow-600 text-white border-yellow-600 shadow-md"
                              : "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Severity
                      </label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as Severity)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alert Message (Optional)
                    </label>
                    <textarea
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter custom alert message..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - Summary (No Analytics) */}
            <div className="col-span-3">
              <div className="sticky top-40 space-y-5">
                {/* Rule Summary - Improved */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Rule Summary</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed mb-4 border border-gray-200">
                    {generateNaturalLanguage()}
                  </div>

                  {/* Structured Summary */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Conditions
                      </p>
                      <ul className="space-y-1">
                        {conditions.map((c) => (
                          <li
                            key={c.id}
                            className="text-xs text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-blue-600">•</span>
                            <span>
                              {c.field.replace(/_/g, " ")} {c.operator} {c.value}
                              {c.timeWindow && (
                                <span className="text-gray-500"> (within {c.timeWindow})</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {conditions.length > 1 && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                          Logic Operator
                        </p>
                        <p className="text-xs text-gray-700">{logicOperator}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Action
                      </p>
                      <p className="text-xs text-gray-700">
                        {actionType} with {severity} severity
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowJsonModal(true)}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2 py-2 rounded-md transition-colors font-medium"
                  >
                    <Code className="h-4 w-4" />
                    View JSON
                  </button>
                </div>

                {/* Quick Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      <p className="font-semibold mb-1">Testing Recommended</p>
                      <p>Save to Sandbox and run simulations before activating in production.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer - Improved Button Hierarchy */}
        <div className="sticky bottom-0 z-30 bg-white border-t-2 border-gray-200 shadow-2xl">
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleValidate}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                <Shield className="h-4 w-4" />
                Validate
              </button>
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSimulation(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
              >
                <Play className="h-4 w-4" />
                Run Simulation
              </button>
              <button
                onClick={handleSaveToSandbox}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
              >
                <Save className="h-4 w-4" />
                Save to Sandbox
              </button>
            </div>
          </div>
        </div>

        {/* Simulation Modal */}
        <SimulationModal
          isOpen={showSimulation}
          onClose={() => setShowSimulation(false)}
          ruleName={ruleName}
        />

        {/* JSON Modal */}
        {showJsonModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Rule JSON</h3>
                </div>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto font-mono">
                  {JSON.stringify(
                    {
                      ruleId: ruleIdState,
                      name: ruleName,
                      category,
                      status,
                      version,
                      conditions,
                      logicOperator,
                      action: {
                        type: actionType,
                        severity,
                        message: alertMessage,
                      },
                      channel,
                      transactionType,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
