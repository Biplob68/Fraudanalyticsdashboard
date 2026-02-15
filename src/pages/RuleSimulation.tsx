import { useState } from "react";
import { Play, RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { SimulationResult } from "../data/ruleManagementData";

export function RuleSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [compareSandboxProd, setCompareSandboxProd] = useState(false);

  // Test transaction inputs
  const [amount, setAmount] = useState("4850.00");
  const [country, setCountry] = useState("NG");
  const [channel, setChannel] = useState("Online");
  const [mcc, setMcc] = useState("5732");
  const [deviceId, setDeviceId] = useState("a1b2c3d4e5f6");
  const [ipAddress, setIpAddress] = useState("185.220.101.23");
  const [vpnDetected, setVpnDetected] = useState(true);

  // Mock simulation results
  const [sandboxResults, setSandboxResults] = useState<SimulationResult[]>([]);
  const [productionResults, setProductionResults] = useState<SimulationResult[]>([]);

  const runSimulation = () => {
    setIsRunning(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockSandboxResults: SimulationResult[] = [
        {
          ruleId: "RULE-001",
          ruleName: "High Risk Country",
          triggered: true,
          action: "BLOCK",
          score: 95,
          reason: "Transaction from high-risk country (NG)"
        },
        {
          ruleId: "RULE-002",
          ruleName: "Unusual Amount",
          triggered: true,
          action: "ALERT",
          score: 78,
          reason: "Amount exceeds 200% of 30-day average"
        },
        {
          ruleId: "RULE-008",
          ruleName: "VPN Detection",
          triggered: true,
          action: "BLOCK",
          score: 88,
          reason: "VPN detected with low IP reputation"
        },
        {
          ruleId: "RULE-003",
          ruleName: "Velocity Check",
          triggered: false,
          action: "PASS",
          score: 0,
          reason: "Transaction velocity within normal range"
        },
        {
          ruleId: "RULE-010",
          ruleName: "First International (Sandbox)",
          triggered: true,
          action: "CASE",
          score: 65,
          reason: "First international transaction detected"
        }
      ];

      const mockProductionResults: SimulationResult[] = mockSandboxResults.filter(
        r => r.ruleId !== "RULE-010" // Sandbox rule not in production
      );

      setSandboxResults(mockSandboxResults);
      setProductionResults(mockProductionResults);
      setIsRunning(false);
      setHasRun(true);
    }, 1500);
  };

  const resetSimulation = () => {
    setHasRun(false);
    setSandboxResults([]);
    setProductionResults([]);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "BLOCK":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "ALERT":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "CASE":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "BLOCK":
        return "bg-red-100 text-red-800";
      case "ALERT":
        return "bg-yellow-100 text-yellow-800";
      case "CASE":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const renderResults = (results: SimulationResult[], title: string) => (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-3">
        {results.map((result) => (
          <div
            key={result.ruleId}
            className={`border rounded-lg p-4 ${
              result.triggered
                ? "border-red-200 bg-red-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getActionIcon(result.action)}
                <div>
                  <p className="font-medium text-gray-900">{result.ruleName}</p>
                  <p className="text-xs text-gray-500">{result.ruleId}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getActionColor(result.action)}`}>
                {result.action}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{result.reason}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    result.score >= 80 ? "bg-red-600" :
                    result.score >= 50 ? "bg-yellow-600" :
                    result.score > 0 ? "bg-blue-600" :
                    "bg-green-600"
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">{result.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Final Decision */}
      <div className="mt-4 bg-gray-900 text-white rounded-lg p-4">
        <p className="text-sm font-semibold mb-2">Final Decision</p>
        <p className="text-lg font-bold">
          {results.some(r => r.action === "BLOCK") ? (
            <span className="text-red-400">TRANSACTION BLOCKED</span>
          ) : results.some(r => r.action === "ALERT" || r.action === "CASE") ? (
            <span className="text-yellow-400">ALERT GENERATED</span>
          ) : (
            <span className="text-green-400">TRANSACTION APPROVED</span>
          )}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Rule Simulation Sandbox</h1>
        <p className="text-sm text-gray-600 mt-1">
          Test rule behavior with sample transactions before deployment
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel: Test Input */}
        <div className="col-span-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4">Test Transaction Input</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Amount
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Code
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="US"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Online">Online</option>
                  <option value="Mobile">Mobile</option>
                  <option value="POS">POS</option>
                  <option value="ATM">ATM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MCC Code
                </label>
                <input
                  type="text"
                  value={mcc}
                  onChange={(e) => setMcc(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="5732"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Fingerprint
                </label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="a1b2c3d4e5f6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP Address
                </label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="192.168.1.1"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vpn"
                  checked={vpnDetected}
                  onChange={(e) => setVpnDetected(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="vpn" className="text-sm text-gray-700">
                  VPN Detected
                </label>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running Simulation..." : "Run Simulation"}
              </button>

              {hasRun && (
                <button
                  onClick={resetSimulation}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              )}
            </div>

            {hasRun && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={compareSandboxProd}
                    onChange={(e) => setCompareSandboxProd(e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">
                    Compare Sandbox vs Production
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Results */}
        <div className="col-span-8">
          {!hasRun ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to Simulate
              </h3>
              <p className="text-sm text-gray-600">
                Configure test transaction parameters and click "Run Simulation" to see how rules would evaluate this transaction
              </p>
            </div>
          ) : compareSandboxProd ? (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                {renderResults(sandboxResults, "Sandbox Environment")}
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                {renderResults(productionResults, "Production Environment")}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              {renderResults(sandboxResults, "Simulation Results")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
