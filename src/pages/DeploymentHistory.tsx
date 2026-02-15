import { ArrowRight, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { deploymentHistory } from "../data/ruleManagementData";

export function DeploymentHistory() {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case "SANDBOX":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "STAGING":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "PRODUCTION":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DEPLOYED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "ROLLED_BACK":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DEPLOYED":
        return "bg-green-100 text-green-800";
      case "APPROVED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ROLLED_BACK":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Group deployments by rule
  const deploymentsByRule = deploymentHistory.reduce((acc, dep) => {
    if (!acc[dep.ruleId]) {
      acc[dep.ruleId] = [];
    }
    acc[dep.ruleId].push(dep);
    return acc;
  }, {} as Record<string, typeof deploymentHistory>);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Deployment History</h1>
        <p className="text-sm text-gray-600 mt-1">
          Track rule deployments across sandbox, staging, and production environments
        </p>
      </div>

      {/* Deployment Pipeline Legend */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Deployment Pipeline</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-24 px-3 py-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg text-center text-sm font-medium">
              SANDBOX
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 px-3 py-2 bg-blue-100 text-blue-800 border border-blue-300 rounded-lg text-center text-sm font-medium">
              STAGING
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="w-24 px-3 py-2 bg-green-100 text-green-800 border border-green-300 rounded-lg text-center text-sm font-medium">
            PRODUCTION
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          Rules must pass through each stage before reaching production. Approvals are required at each transition.
        </p>
      </div>

      {/* Deployments by Rule */}
      <div className="space-y-6">
        {Object.entries(deploymentsByRule).map(([ruleId, deployments]) => (
          <div key={ruleId} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Rule Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{deployments[0].ruleName}</h3>
                  <p className="text-sm text-gray-600 font-mono">{ruleId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    {deployments.length} deployment{deployments.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-5">
              <div className="space-y-4">
                {deployments.map((deployment, index) => (
                  <div key={deployment.id} className="relative">
                    {/* Connector line */}
                    {index < deployments.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                    )}

                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getStatusIcon(deployment.status)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded border text-sm font-medium ${getStageColor(deployment.stage)}`}>
                              {deployment.stage}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(deployment.status)}`}>
                              {deployment.status}
                            </span>
                            <span className="text-sm text-gray-600 font-mono">
                              {deployment.version}
                            </span>
                          </div>
                          {deployment.deployedAt && (
                            <span className="text-xs text-gray-500">{deployment.deployedAt}</span>
                          )}
                        </div>

                        {deployment.approvedBy && (
                          <p className="text-sm text-gray-600 mb-1">
                            Approved by: <span className="font-medium">{deployment.approvedBy}</span>
                          </p>
                        )}

                        {deployment.notes && (
                          <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded p-2 mt-2">
                            {deployment.notes}
                          </p>
                        )}

                        {/* Actions */}
                        {deployment.status === "PENDING" && (
                          <div className="flex items-center gap-2 mt-3">
                            <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                              Approve & Promote
                            </button>
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors">
                              Reject
                            </button>
                          </div>
                        )}

                        {deployment.status === "APPROVED" && (
                          <div className="flex items-center gap-2 mt-3">
                            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                              Deploy to {deployment.stage === "SANDBOX" ? "Staging" : "Production"}
                            </button>
                          </div>
                        )}

                        {deployment.status === "DEPLOYED" && deployment.stage === "PRODUCTION" && (
                          <div className="flex items-center gap-2 mt-3">
                            <button className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition-colors">
                              Rollback
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log Section */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Audit Log</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-gray-900">RULE-008 deployed to PRODUCTION</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span>Michael Torres</span>
              <span className="text-xs">2026-02-03 15:25</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-gray-900">RULE-003 approved for STAGING</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span>Sarah Chen</span>
              <span className="text-xs">2026-02-03 12:15</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-gray-900">RULE-002 rolled back from PRODUCTION</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span>Michael Torres</span>
              <span className="text-xs">2026-01-22 14:15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
