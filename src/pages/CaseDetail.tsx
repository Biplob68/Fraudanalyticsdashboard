import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { 
  ArrowLeft, 
  AlertCircle, 
  CreditCard, 
  MapPin, 
  Store, 
  Calendar,
  User,
  MessageSquare,
  Paperclip,
  CheckCircle,
  XCircle,
  Save
} from "lucide-react";
import { cases, CaseStatus, RiskLevel } from "../data/caseData";

export function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const caseItem = cases.find(c => c.id === caseId);

  const [newNote, setNewNote] = useState("");
  const [localStatus, setLocalStatus] = useState(caseItem?.status || "OPEN");

  if (!caseItem) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-red-900 mb-2">Case Not Found</h2>
          <p className="text-sm text-red-700 mb-4">The case {caseId} could not be found.</p>
          <Link to="/case-inbox" className="text-red-600 hover:text-red-800 text-sm font-medium">
            ← Back to Case Inbox
          </Link>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "CRITICAL":
        return "bg-red-600 text-white";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "UNDER_REVIEW":
        return "bg-purple-100 text-purple-800";
      case "CONFIRMED_FRAUD":
        return "bg-red-100 text-red-800";
      case "FALSE_POSITIVE":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      alert(`Note added: ${newNote}`);
      setNewNote("");
    }
  };

  const handleStatusChange = (newStatus: CaseStatus) => {
    setLocalStatus(newStatus);
    alert(`Case status changed to: ${newStatus}`);
  };

  const handleConfirmFraud = () => {
    handleStatusChange("CONFIRMED_FRAUD");
  };

  const handleMarkFalsePositive = () => {
    handleStatusChange("FALSE_POSITIVE");
  };

  const handleCloseCase = () => {
    handleStatusChange("CLOSED");
    setTimeout(() => navigate("/case-inbox"), 1000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/case-inbox"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Case Inbox
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Case Details</h1>
            <p className="text-sm text-gray-600 mt-1 font-mono">{caseItem.id}</p>
          </div>
          <Link
            to="/entity-links"
            state={{ caseId: caseItem.id }}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            View Entity Links
          </Link>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <div className="grid grid-cols-5 gap-6">
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Status</p>
            <span className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-medium ${getStatusColor(localStatus)}`}>
              {localStatus.replace(/_/g, " ")}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Risk Level</p>
            <span className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-medium ${getRiskColor(caseItem.riskLevel)}`}>
              {caseItem.riskLevel}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Assigned Analyst</p>
            <p className="text-sm font-medium text-gray-900">{caseItem.assignedAnalyst}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Created</p>
            <p className="text-sm font-medium text-gray-900">{caseItem.createdAt}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Last Updated</p>
            <p className="text-sm font-medium text-gray-900">{caseItem.lastUpdated}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Section: Transaction Details */}
        <div className="col-span-7 space-y-6">
          {/* Transaction Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Transaction Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                <p className="text-sm font-mono text-gray-900">{caseItem.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${caseItem.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Channel</p>
                <p className="text-sm text-gray-900">{caseItem.channel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Card</p>
                <p className="text-sm font-mono text-gray-900">**** {caseItem.cardLast4}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Merchant</p>
                <p className="text-sm text-gray-900">{caseItem.merchantName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Transaction Time</p>
                <p className="text-sm text-gray-900">{caseItem.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Triggered Rules */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Triggered Rules ({caseItem.triggeredRules.length})
            </h3>
            <div className="space-y-3">
              {caseItem.triggeredRules.map((ruleId) => (
                <div key={ruleId} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{ruleId}</p>
                      <p className="text-xs text-gray-600">Risk score: 85 | Action: BLOCK</p>
                    </div>
                    <Link
                      to={`/rule-performance`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Rule
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Context */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Additional Context</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">Lagos, Nigeria (IP: 185.220.101.23)</p>
                  <p className="text-red-600 text-xs mt-1">⚠ VPN detected</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Store className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Merchant Risk</p>
                  <p className="text-gray-600">MCC: 5732 (Electronics) - High Risk Category</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Account History</p>
                  <p className="text-gray-600">Card opened: 2024-05-15 (9 months ago)</p>
                  <p className="text-gray-600">Previous disputes: 0</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Customer Profile</p>
                  <p className="text-gray-600">Typical spending: $200-500/month</p>
                  <p className="text-red-600 text-xs mt-1">⚠ Transaction amount is 10x typical</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Notes & Evidence */}
        <div className="col-span-5 space-y-6">
          {/* Analyst Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Analyst Notes
            </h3>
            <div className="space-y-3 mb-4">
              {caseItem.notes.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No notes yet</p>
              ) : (
                caseItem.notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs font-medium text-gray-900">{note.analyst}</p>
                      <p className="text-xs text-gray-500">{note.timestamp}</p>
                    </div>
                    <p className="text-sm text-gray-700">{note.content}</p>
                  </div>
                ))
              )}
            </div>
            <div className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add investigation notes..."
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleAddNote}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <Save className="h-4 w-4" />
                Add Note
              </button>
            </div>
          </div>

          {/* Evidence Attachments */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Paperclip className="h-5 w-5 text-green-600" />
              Evidence Attachments
            </h3>
            <div className="space-y-2">
              {caseItem.evidenceAttachments.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No attachments</p>
              ) : (
                caseItem.evidenceAttachments.map((evidence) => (
                  <div key={evidence.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{evidence.name}</p>
                      <p className="text-xs text-gray-500">
                        {evidence.type} • {evidence.uploadedBy} • {evidence.uploadedAt}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View
                    </button>
                  </div>
                ))
              )}
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-medium">
              <Paperclip className="h-4 w-4" />
              Upload Evidence
            </button>
          </div>

          {/* Case Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Case Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleConfirmFraud}
                disabled={localStatus === "CONFIRMED_FRAUD"}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Confirm Fraud
              </button>
              <button
                onClick={handleMarkFalsePositive}
                disabled={localStatus === "FALSE_POSITIVE"}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                Mark False Positive
              </button>
              <button
                onClick={handleCloseCase}
                disabled={localStatus === "CLOSED"}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Close Case
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
